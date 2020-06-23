from random import random, randint
from requests import post
from time import sleep
from json import dumps
from os import environ
from random import lognormvariate, vonmisesvariate, gauss

if environ.get('FLASK_ENV') is None:
    URL = 'http://localhost:4545/dataBroker/'
else:
    URL = 'http://clusterer:4545/dataBroker/'

headers = {'Content-type': 'application/json'}


def start():

    while True:
        try:
            print('new request is sent')
            body = {
                'data': [],
                'dimensions': ["cpu", "traffic", "ram", "kinergy", "io"]
            }
            for resource_id in range(5):
                for _ in range(50):
                    temp_data_point = []
                    for i in range(len(body['dimensions'])):
                        # i = 10
                        if i == 0: 
                            temp_data_point.append(gauss(randint(0, 5*i), 35))
                        elif i == 1:
                            temp_data_point.append(gauss(randint(0, 5*i), 35))
                        elif i == 2:
                            temp_data_point.append(gauss(randint(0, 5*i), 35))
                        elif i == 3:
                            temp_data_point.append(gauss(randint(0, 5*i), 35))
                        elif i == 4:
                            temp_data_point.append(gauss(randint(0, 5*i), 35))
                        elif i == 5:
                            temp_data_point.append(gauss(randint(0, 5*i), 35))
                        else:
                            temp_data_point.append(lognormvariate(10, 3))
                    body['data'].append(temp_data_point)
                post(URL+str(resource_id), data=dumps(body), headers=headers)
            sleep(1)
        except Exception as e:
            print(e)
            sleep(5)
        else:
            pass
        finally:
            pass

def send_cluster():
    customs_url = URL.replace('dataBroker', 'clusterBroker')
    while True:
        try:
            print('new cluster is sent')
            clusters = []
            body = {
                'clusters': clusters,
                'dimensions': ['cpu', 'memory']
            }
            for resource_id in range(5):
                for _ in range(20):
                    clusters.append({
                        'centroid': [gauss(0, 35), gauss(0, 35)],
                        'radius': abs(gauss(0, 10))
                    })

                post(customs_url+str(resource_id), data=dumps(body), headers=headers)
            sleep(1)
        except Exception as e:
            print(e)
            sleep(5)

if __name__ == "__main__":

    if environ.get('DATA_TO_GEN') is None:
        start()
    else:
        send_cluster()
