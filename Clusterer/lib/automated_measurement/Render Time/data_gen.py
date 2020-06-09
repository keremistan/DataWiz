from random import random, randint
from requests import post
from time import sleep
from json import dumps
from os import environ
from random import lognormvariate, vonmisesvariate, gauss
import time
import math
import webbrowser
from selenium import webdriver
from multiprocessing import Process
from subprocess import run, call


URL = 'http://localhost:9999/dataBroker/'


def start():

    driver = webdriver.Chrome('./chromedriver')
    driver.get('http://localhost:3000')


    headers = {'Content-type': 'application/json'}
    counter = 0
    amounts_to_be_sent = list(range(250, 25250, 250))
    lap = 5 * 60 # 5 dk
    start_time = time.time()
    resource_ids = ['1']
    while True:
        try:
            
            time_diff = time.time() - start_time
            current_lap = math.floor(time_diff / lap)
            if current_lap > counter:
                counter += 1
            if counter >= len(amounts_to_be_sent):
                break

            body = {
                'data': [],
                'dimensions': ["cpu", "mpu", "traffic", "ram", "imo", "kinergy"]
            }
            print('sending '+ str(amounts_to_be_sent[counter]) +' data')
            for resource_id in resource_ids:
                for _ in range(amounts_to_be_sent[counter]):
                    temp_data_point = []
                    for i in range(6):
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
    
    driver.close()
    call(['python3', 'visualise_render_times.py'])


if __name__ == "__main__":
    start()
    pass
