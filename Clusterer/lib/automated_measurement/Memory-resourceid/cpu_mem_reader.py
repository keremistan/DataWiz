import math
import argparse
import pandas as pd
from traceback import print_exc
import matplotlib.pyplot as plt
import os
import sys
from pprint import pprint
import numpy as np
import seaborn as sns; sns.set(color_codes=True)

categories = ['cpu_500', 'cpu_1000', 'mem_500', 'mem_1000']


def text_file_sorter(el):
    splitted_el = el.split('_')
    data_points = int(splitted_el[0])
    reqs = int(splitted_el[2])
    return (data_points, reqs)

# cite: https://stackoverflow.com/questions/354038/how-do-i-check-if-a-string-is-a-number-float
def check_number(number_string):
    try:
        if number_string == '-':
            return False

        float(number_string)
        return True
    except ValueError:
        print_exc()


def read_data_files():
    all_files = []
    for _, _, file_names in os.walk('.'):
        all_files.append(file_names)

    cwd_all_files = all_files[0]
    cwd_all_txt_files = list(filter(lambda x: '.txt' in x, cwd_all_files))
    cwd_all_txt_files = sorted(cwd_all_txt_files, key=text_file_sorter)
    return cwd_all_txt_files


def visualise_results(all_extracted_vals, intervals):
    cpu_means, mem_means = get_means(all_extracted_vals)

    # cpu_df = pd.DataFrame({'x': intervals, '500_points': cpu_means['cpu_500'], '1000_points': cpu_means['cpu_1000']})
    cpu_df = pd.DataFrame({'x': intervals, '500_points': cpu_means['cpu_500']})
    plt.plot('x', '500_points', data=cpu_df)
    # plt.plot('x', '1000_points', data=cpu_df)
    plt.xlabel('Simultaneous Requests')
    plt.ylabel('Cpu Load %')
    plt.legend()
    plt.savefig('cpu.png')

    plt.figure()
    # cpu_df = pd.DataFrame({'x': intervals, '500_points': mem_means['mem_500'], '1000_points': mem_means['mem_1000']})
    cpu_df = pd.DataFrame({'x': intervals, '500_points': mem_means['mem_500']})
    plt.plot('x', '500_points', data=cpu_df)
    # plt.plot('x', '1000_points', data=cpu_df)
    plt.xlabel('Simultaneous Requests')
    plt.ylabel('Memory Load (MiB)')
    plt.legend()
    plt.savefig('memory.png')


def get_means(all_extracted_vals):
    cpu_means = {'cpu_500': [], 'cpu_1000': []}
    mem_means = {'mem_500': [], 'mem_1000': []}

    for cpu in ['cpu_500', 'cpu_1000']:
        for curr_req in all_extracted_vals[cpu]:
            # redis and clusterer are one system, not two.
            mean_curr_req = np.mean(curr_req) * 2
            cpu_means[cpu].append(mean_curr_req)

    for mem in ['mem_500', 'mem_1000']:
        for curr_req in all_extracted_vals[mem]:
            mean_curr_req = np.mean(curr_req) * 2  # see above.
            mem_means[mem].append(mean_curr_req)

    return cpu_means, mem_means


if __name__ == "__main__":

    arguments_parser = argparse.ArgumentParser()
    arguments_parser.add_argument('--intervals',
                                  nargs='*',
                                  type=int,
                                  default=[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121, 123, 125, 127, 129, 131, 133, 135, 137, 139, 141, 143, 145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167, 169, 171, 173, 175, 177, 179, 181, 183, 185, 187, 189, 191, 193, 195, 197, 199, 201, 203, 205, 207, 209, 211, 213, 215, 217, 219, 221, 223, 225, 227, 229, 231, 233, 235, 237, 239, 241, 243, 245]
                                  )
    args = arguments_parser.parse_args()

    try:
        cwd_all_txt_files = read_data_files()
        all_extracted_vals = {
            'mem_500': [],
            'mem_1000': [],
            'cpu_500': [],
            'cpu_1000': []
        }

        for curr_cwd_txt_file in cwd_all_txt_files:
            temp_file = {
                'cpu': [],
                'mem': []
            }
            with open(curr_cwd_txt_file, mode='r') as reader:
                for line in reader.readlines():
                    if 'clusterer' in line or 'redis' in line:
                        line_as_list = line.split()

                        cpu_val_with_perc = line_as_list[2][:-1]
                        mem_val_with_M = line_as_list[3][:-3]

                        if check_number(cpu_val_with_perc) and check_number(mem_val_with_M):
                            cpu_val = float(cpu_val_with_perc)
                            mem_val = float(mem_val_with_M)

                            temp_file['mem'].append(mem_val)
                            temp_file['cpu'].append(cpu_val)

                if '500_points' in curr_cwd_txt_file:
                    all_extracted_vals['mem_500'].append(temp_file['mem'])
                    all_extracted_vals['cpu_500'].append(temp_file['cpu'])
                elif '1000_points' in curr_cwd_txt_file:
                    all_extracted_vals['mem_1000'].append(temp_file['mem'])
                    all_extracted_vals['cpu_1000'].append(temp_file['cpu'])
    except Exception:
        print_exc()

    visualise_results(all_extracted_vals, args.intervals)
