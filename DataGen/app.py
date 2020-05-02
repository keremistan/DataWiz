from random import random
from requests import post
from time import sleep
from json import dumps

URL = 'http://localhost:4545/dataBroker'

def start():
    headers = {'Content-type': 'application/json'}
    body = {
        'data': []
    }
    while True:
        for _ in range(10):
            temp_data_point = []
            for _ in range(5):
                temp_data_point.append(random())
            body['data'].append(temp_data_point)
        post(URL, data=dumps(body), headers=headers)
        body['data'] = []
        sleep(0.5)

if __name__ == "__main__":
    start()