from flask_restful import Resource, reqparse
from json import dumps
from flask import request
import evoStream
import redis
from os import environ
from pyclustering.cluster.birch import birch
from pyclustering.cluster import cluster_visualizer
from pyclustering.utils import read_sample
from pyclustering.samples.definitions import FAMOUS_SAMPLES
from pyclustering.cluster.dbscan import dbscan
from pyclustering.samples.definitions import FCPS_SAMPLES
CLUSTERING_ALGO = 'dbscan'
# CLUSTERING_ALGO = 'birch'


class DataBroker(Resource):
    def __init__(self):
        if environ.get('FLASK_ENV') is None:
            self.redis_client = redis.Redis()
        else:
            self.redis_client = redis.Redis('redis', 6379)
        # print('flask env chosen: {}'.format(environ.get('FLASK_ENV')))

        super(DataBroker, self).__init__()

    def get(self):
        try:
            latest = self.redis_client.get('latest')
            latest = latest.decode('utf-8')
            return dumps(latest)
        except Exception as e:
            print(e)

    def post(self):
        data = request.get_json()['data']

        if CLUSTERING_ALGO is 'dbscan':
            clusters = self.dbscan(data)
        elif CLUSTERING_ALGO is 'birch':
            clusters = self.birch(data)
        else:
            clusters = self.dbscan(data)

        clusters.sort(reverse=True, key=lambda cluster: len(cluster))

        if len(clusters) > 0:        
            biggest_cluster = clusters[0]

            both = {
                'raw_data': data,
                'cluster': biggest_cluster,
            }

            self.redis_client.set('latest', dumps(both))

    def dbscan(self, data):
        # Create DBSCAN algorithm.
        dbscan_instance = dbscan(data, 10, 3)
        # Start processing by DBSCAN.
        dbscan_instance.process()
        # Obtain results of clustering.
        clusters = dbscan_instance.get_clusters()
        return clusters

    def birch(self, data):
        birch_instance = birch(data, 10, diameter=0.5)
        # Cluster analysis
        birch_instance.process()
        # Obtain results of clustering
        clusters = birch_instance.get_clusters()
        return clusters
