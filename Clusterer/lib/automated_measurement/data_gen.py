from random import random, randint
from requests import post
from time import sleep
from json import dumps
from os import environ
from random import lognormvariate, vonmisesvariate, gauss
import multiprocessing
from time import time
from os import system, getpid, kill
import signal
from subprocess import run, call, Popen, TimeoutExpired, PIPE
from traceback import print_exc

if environ.get('FLASK_ENV') is None:
    URL = 'http://localhost:4545/dataBroker/'
else:
    URL = 'http://clusterer:4545/dataBroker/'


def start(resource_id, data_points):
    headers = {'Content-type': 'application/json'}
    while True:
        try:

            body = {
                'data': [],
                'dimensions': ["cpu", "mpu", "traffic", "ram", "imo", "kinergy"]
            }

            for _ in range(int(data_points)):
                temp_data_point = []
                for i in range(6):
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
            print('new request is sent')
            sleep(1)
        except Exception as e:
            print(e)
            sleep(5)
        else:
            pass
        finally:
            pass

def record_system_load(data_points, reqs, timeout):

    f = open(data_points + '_points_' + reqs + '_req.txt', 'w')
    proc = Popen('docker stats', shell=True, stdout=f)
    try:
        outs, errs = proc.communicate(timeout=timeout)
    except TimeoutExpired:
        f.close()
        proc.kill()
        outs, errs = proc.communicate()

def compose_up(timeout):
    proc = Popen('docker-compose up', shell=True, cwd='/Users/base/MEGA/Universität/Tez/DataWiz')
    try:
        outs, errs = proc.communicate(timeout=timeout)
    except TimeoutExpired:
        proc.kill()
        outs, errs = proc.communicate()            

def remove_containers():
    call('docker rm $(docker ps -aq)', shell=True)

def stop_containers():
    call(['docker-compose', 'stop'], cwd='/Users/base/MEGA/Universität/Tez/DataWiz')

if __name__ == "__main__":
    for data_points in ['500', '1000']:
        for reqs in ['1', '5', '10', '20', '50']:
            try:
                secs = 10 + 0*1  # 5 saniye
                timeout = time() + secs

                composer = multiprocessing.Process(target=compose_up, args=(secs, ))
                composer.start()

                sub_instances = []
                for instance in range(int(reqs)):
                    p = multiprocessing.Process(
                        target=start, args=(instance, data_points, ))
                    p.start()
                    sub_instances.append(p)

                recorder = multiprocessing.Process(target=record_system_load, args=(data_points, reqs, secs, ))
                recorder.start()

                while True:
                    all_killed = True
                    if time() > timeout:
                        for sub_instance in sub_instances:
                            if sub_instance.is_alive() == True:
                                sub_instance.kill()
                                all_killed &= False
                            else:
                                all_killed &= True
                        if all_killed == True:
                            break

                print('containers are being stopped & removed')
                stop_containers()
                remove_containers()
                
                sleep(1)
            except Exception:
                print_exc()
