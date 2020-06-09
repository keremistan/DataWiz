from flask_restful import Resource, reqparse
from json import dumps
from flask import request
import redis
from os import environ
from pprint import pprint
from json import dumps

class ClusterBroker(Resource):
    def __init__(self):
        if environ.get('FLASK_ENV') is None:
            self.redis_client = redis.Redis()
        else:
            self.redis_client = redis.Redis('redis', 6379)
        super(ClusterBroker, self).__init__()

    def post(self, resource_id):
        data = request.get_json()['data']
        dimensions = request.get_json()['dimensions']
        all_clusters = request.get_json()['clusters']

        # TODO: Complete this function

        both = {
            'raw_data': data,
            'cluster': biggest_cluster,
            'all_clusters': clusters.tolist(),
            'dimensions': dimensions
        }

        self.redis_client.set(resource_id, dumps(both))
