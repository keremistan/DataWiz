from flask_restful import Resource, reqparse
from json import dumps
from flask import request
import evoStream
import redis
from os import environ


class DataBroker(Resource):
    def __init__(self):
        if environ.get('FLASK_ENV') is None:
            self.redis_client = redis.Redis()
        else:
            self.redis_client = redis.Redis('redis', 6379)
        print('flask env chosen: {}'.format(environ.get('FLASK_ENV')))

        super(DataBroker, self).__init__()

    def get(self):
        latest = self.redis_client.get('latest')
        latest = latest.decode('utf-8')
        return dumps(latest)

    def post(self):
        body = request.get_json()

        # From the c++ source file
        # EvoStream::EvoStream(double r, double lambda, int tgap, unsigned int k, double crossoverRate, double mutationRate, int populationSize, unsigned int initializeAfter, int reclusterGenerations){
        evo = evoStream.EvoStream(
            # 0.05, 0.001, 100, 4, .8, .001, 100, 2*4, 1000)
            0.05, 0.001, 100, 4, .8, .001, 100, 2*4, 10)
        data = request.get_json()['data']
        for row in data:
            # print(row)
            evo.cluster(row)
            # evaluate 1 generation after every observation. This can be adapted to the available time
            evo.recluster(1)

        # print("Micro Clusters:")
        x = evo.get_microclusters()
        microclusters = x
        # print('# of micros:{}'.format(len(x)))

        # print("\nMicro Weights:")
        x = evo.get_microweights()

        # print("\nMacro Clusters (here: performs an additional 1000 reclustering steps, see parameter)")
        x = evo.get_macroclusters()
        # print('# of macros:{}'.format(len(x)))

        # print("\nMacro Weights")
        x = evo.get_macroweights()

        # print("\nAssignment of Micro Clusters to Macro Clusters")
        x = evo.microToMacro()

        # print('Read endpoint is run')

        # from time import time_ns
        # for cluster in microclusters:
        #     cluster.insert(0, time_ns())

        both = {
            'raw_data': data,
            'clusters': microclusters
        }

        self.redis_client.set('latest', dumps(both))
