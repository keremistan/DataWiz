from flask_restful import Resource, reqparse
from json import dumps
from flask import request
import redis
from os import environ
from pprint import pprint
from json import dumps
from traceback import print_exc


class ClusterBroker(Resource):
    def __init__(self):
        if environ.get('FLASK_ENV') is None:
            self.redis_client = redis.Redis()
        else:
            self.redis_client = redis.Redis('redis', 6379)
        super(ClusterBroker, self).__init__()

    def post(self, resource_id):
        try:
            clusters = request.get_json()['clusters']
            dimensions = request.get_json()['dimensions']
            data = {
                'clusters': clusters,
                'dimensions': dimensions
            }
            self.redis_client.set('clustered:'+str(resource_id), dumps(data))
        except Exception as e:
            print_exc(e)

    def get(self, resource_id):
        try:
            if resource_id == 'default':
                resources = self.redis_client.keys()
                clustered_resources = list(map(lambda res: res.decode(), resources))
                clustered_resources = list(filter(lambda res: 'clustered:' in res, clustered_resources))
                clustered_resources.sort(key=lambda cluster: int(cluster[-1]))
                resource_id = clustered_resources[0][-1] # first element's last character (number)

            latest = self.redis_client.get('clustered:' + str(resource_id))
            if latest == None:
                resource_not_found = dumps(
                    {'type': 'error', 'message': 'ResourceNotFound'})
                return resource_not_found
            else:
                latest = latest.decode('utf-8')
                return dumps(latest)

        except Exception as e:
            print_exc(e)
