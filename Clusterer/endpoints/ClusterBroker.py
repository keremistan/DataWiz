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
            data = {'clusters': clusters}
            self.redis_client.set('clustered:'+resource_id, dumps(data))
        except Exception as e:
            print_exc(e)

    def get(self, resource_id):
        try:
            if resource_id == 'default':
                resource_id = self.redis_client.keys()[0]
            latest = self.redis_client.get('clustered:'+resource_id)
            if latest == None:
                resource_not_found = dumps(
                    {'type': 'error', 'message': 'ResourceNotFound'})
                return resource_not_found
            else:
                latest = latest.decode('utf-8')
                return dumps(latest)

        except Exception as e:
            print_exc(e)
