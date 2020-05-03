from random import random, randint
from requests import post
from time import sleep
from json import dumps

URL = 'http://localhost:4545/dataBroker'

def start():
    headers = {'Content-type': 'application/json'}
    while True:
        print('new request is sent')
        body = {
            'data': []
        }
        for _ in range(50):
            temp_data_point = []
            for _ in range(5):
                temp_data_point.append(random())
            body['data'].append(temp_data_point)
        post(URL, data=dumps(body), headers=headers)
        sleep(3)

if __name__ == "__main__":
    start()