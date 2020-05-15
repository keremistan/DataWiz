from flask_restful import Resource, reqparse
from json import dumps
from flask import request
import redis
from os import environ
from sklearn.cluster import DBSCAN, Birch
from pprint import pprint

# Choose an algorithm by oncommenting
CLUSTERING_ALGO = 'dbscan'
# CLUSTERING_ALGO = 'birch'


class DataBroker(Resource):
    def __init__(self):
        if environ.get('FLASK_ENV') is None:
            self.redis_client = redis.Redis()
        else:
            self.redis_client = redis.Redis('redis', 6379)
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

        if CLUSTERING_ALGO == 'dbscan':
            clusters = DBSCAN(10, 2).fit_predict(data)
        elif CLUSTERING_ALGO == 'birch':
            clusters = Birch().fit_predict(data)
        else:
            clusters = DBSCAN(10, 2).fit_predict(data)

        clustering_summary = self.clusters_info(clusters)
        biggest_cluster_index = max(clustering_summary, key=clustering_summary.get)
        biggest_cluster = []
        clusters_len = len(clusters)
        counter = 0
        for cluster in clusters:
            if(cluster == biggest_cluster_index):
                biggest_cluster.append(counter)
            counter += 1

        both = {
            'raw_data': data,
            'cluster': biggest_cluster,
        }

        self.redis_client.set('latest', dumps(both))


    def clusters_info(self, clusters):
        cluster_names = set(clusters)
        cluster_summary = {}

        for name in cluster_names:
            cluster_summary[name] = 0

        for cluster in clusters:
            cluster_summary[cluster] += 1

        # Remove noise, if there is any
        if -1 in cluster_summary.keys():
            del cluster_summary[-1]

        return cluster_summary