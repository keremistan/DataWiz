from flask_restful import Resource, reqparse
from json import dumps
from flask import request
import redis
from os import environ
from sklearn.cluster import DBSCAN, Birch, KMeans, OPTICS
from pprint import pprint
from json import dumps
# Choose an algorithm by oncommenting
CLUSTERING_ALGO = 'kmeans'
# CLUSTERING_ALGO = 'optics'
# CLUSTERING_ALGO = 'dbscan'
# CLUSTERING_ALGO = 'birch'


class DataBroker(Resource):
    def __init__(self):
        if environ.get('FLASK_ENV') is None:
            self.redis_client = redis.Redis()
        else:
            self.redis_client = redis.Redis('redis', 6379)
        super(DataBroker, self).__init__()

    def get(self, resource_id):
        try:
            if resource_id == 'default':
                resources = self.redis_client.keys()
                resources = list(map(lambda res: res.decode(), resources))
                resources = list(filter(lambda res: 'clustered:' not in res, resources))
                resources.sort()
                resource_id = resources[0]

            latest = self.redis_client.get(resource_id)
            if latest == None:
                resource_not_found = dumps({'type': 'error', 'message': 'ResourceNotFound'})
                return resource_not_found
            else:
                latest = latest.decode('utf-8')
                return dumps(latest)

        except Exception as e:
            print(e)

    def post(self, resource_id):
        data = request.get_json()['data']
        dimensions = request.get_json()['dimensions']

        if CLUSTERING_ALGO == 'dbscan':
            clusters = DBSCAN(eps=30, min_samples=5).fit_predict(data)
        elif CLUSTERING_ALGO == 'birch':
            clusters = Birch().fit_predict(data)
        elif CLUSTERING_ALGO == 'kmeans':
            clusters = KMeans().fit_predict(data)
        elif CLUSTERING_ALGO == 'optics':
            clusters = OPTICS().fit_predict(data)
        elif CLUSTERING_ALGO == 'birch':
            clusters = Birch().fit_predict(data)
        else:
            clusters = DBSCAN(eps=30, min_samples=5).fit_predict(data)

        clustering_summary = self.clusters_info(clusters)
        # TODO: fix the constant error throwing of max 
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
            'all_clusters': clusters.tolist(),
            'dimensions': dimensions
        }

        self.redis_client.set(resource_id, dumps(both))


    def clusters_info(self, clusters):
        cluster_names = set(clusters)
        cluster_summary = {}

        for name in cluster_names:
            cluster_summary[name] = 0

        for cluster in clusters:
            cluster_summary[cluster] += 1

        # Removes noise, if there is any
        if -1 in cluster_summary.keys():
            del cluster_summary[-1]

        return cluster_summary