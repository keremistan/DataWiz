import os
import sys
from pprint import pprint
import seaborn as sns
import matplotlib.pyplot as plt

sns.set(color_codes=True)

all_files = []
for _, _, file_names in os.walk('.'):
    all_files.append(file_names)

cwd_all_files = all_files[0]
cwd_all_txt_files = list(filter(lambda x: '.txt' in x, cwd_all_files))

all_extracted_vals = {}

for curr_cwd_txt_file in cwd_all_txt_files:
    temp_file = {
        'cpu': [],
        'mem': []
    }
    with open(curr_cwd_txt_file, mode='r') as reader:
        for line in reader.readlines():
            if 'CPU usage' in line:
                line_as_list = line.split()
                cpu_val_with_perc = line_as_list[2]
                cpu_val = float(cpu_val_with_perc[:-1])
                temp_file['cpu'].append(cpu_val)
            elif 'com.docker.hyper ' in line:
                line_as_list = line.split()
                mem_val_with_M = line_as_list[3]
                mem_val = float(mem_val_with_M[:-1])
                temp_file['mem'].append(mem_val)
        all_extracted_vals[curr_cwd_txt_file] = temp_file


        title = curr_cwd_txt_file[:-4]
        fig, axs = plt.subplots(2, 1, constrained_layout=True)
        axs[0].plot(range(len(temp_file['mem'])), temp_file['mem'], label='mem')
        axs[0].set_xlabel('time')
        axs[0].set_ylabel('memory load')
        axs[0].set_title(title)

        axs[1].plot(range(len(temp_file['cpu'])), temp_file['cpu'], label='cpu')
        axs[1].set_xlabel('time')
        axs[1].set_ylabel('cpu load')
        axs[1].set_title(title)
        plt.savefig(title + '.png')

print(all_extracted_vals)