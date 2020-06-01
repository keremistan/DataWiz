from multiprocessing import Process
from subprocess import Popen
import shlex
import time

def start_redis():
    command = shlex.split('redis-server --port 6380')
    Popen(command)

def start_react_dev_env():
    command = shlex.split('python3 app.py --port 9999 --redis 6380')
    Popen(command, cwd='/Users/base/MEGA/Universität/Tez/DataWiz/Clusterer')
    Popen(['yarn', 'start'], cwd='/Users/base/MEGA/Universität/Tez/DataWiz/front')

def start_rendering_latency():
    command = shlex.split('python3 data_gen.py')
    Popen(command, cwd='/Users/base/MEGA/Universität/Tez/DataWiz/Clusterer/lib/automated_measurement/Render Time')

if __name__ == "__main__":
    
    p1 = Process(target=start_redis)
    p2 = Process(target=start_react_dev_env)
    p4 = Process(target=start_rendering_latency)
    procs = [p1, p2, p4]

    for p in procs:
        p.start()
        time.sleep(10)