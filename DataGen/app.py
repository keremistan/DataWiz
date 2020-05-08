from random import random, randint
from requests import post
from time import sleep
from json import dumps
from os import environ

print(environ)
if environ.get('FLASK_ENV') is None:
    URL = 'http://localhost:4545/dataBroker'
else:
    URL = 'http://clusterer:4545/dataBroker'


def start():
    headers = {'Content-type': 'application/json'}
    while True:
        try:
            print('new request is sent')
            body = {
                'data': []
            }
            for _ in range(300):
                temp_data_point = []
                for _ in range(5):
                    i = 10
                    if i is 0: 
                        temp_data_point.append(random())
                    elif i is 1:
                        temp_data_point.append(randint(10, 20))
                    elif i is 2:
                        temp_data_point.append(randint(20, 30))
                    elif i is 3:
                        temp_data_point.append(randint(30, 40))
                    elif i is 4:
                        temp_data_point.append(randint(40, 50))
                    else:
                        temp_data_point.append(randint(0, 50))
                body['data'].append(temp_data_point)
            post(URL, data=dumps(body), headers=headers)
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
