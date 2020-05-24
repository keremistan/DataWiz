from random import random, randint
from requests import post
from time import sleep
from json import dumps
from os import environ
from random import lognormvariate, vonmisesvariate, gauss
print(environ)
if environ.get('FLASK_ENV') is None:
    URL = 'http://localhost:4545/dataBroker/'
else:
    URL = 'http://clusterer:4545/dataBroker/'


def start():
    headers = {'Content-type': 'application/json'}
    while True:
        try:
            print('new request is sent')
            body = {
                'data': []
            }
            for resource_id in range(5):
                for _ in range(300):
                    temp_data_point = []
                    for i in range(5):
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


if __name__ == "__main__":
    start()
    pass
