from flask_restful import Resource, reqparse
from json import dumps
from flask import request
from os import environ
from pprint import pprint
from json import dumps


class RenderingLatencyResults(Resource):
    def __init__(self):
        super(RenderingLatencyResults, self).__init__()
        self.target_folder_addr = '/Users/base/MEGA/Universität/Tez/DataWiz/Clusterer/lib/automated_measurement/Render Time/'

    def post(self, qty_of_points):
        data = request.get_json()

        with open(self.target_folder_addr + qty_of_points + '.json', 'w') as f:
            f.write(dumps(data))
            f.flush()