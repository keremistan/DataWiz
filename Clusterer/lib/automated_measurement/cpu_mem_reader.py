import os
import sys
from pprint import pprint
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

sns.set(color_codes=True)


def text_file_sorter(el):
    splitted_el = el.split('_')
    data_points = int(splitted_el[0])
    reqs = int(splitted_el[2])
    return (data_points, reqs)


all_files = []
for _, _, file_names in os.walk('.'):
    all_files.append(file_names)

cwd_all_files = all_files[0]
cwd_all_txt_files = list(filter(lambda x: '.txt' in x, cwd_all_files))
cwd_all_txt_files = sorted(cwd_all_txt_files, key=text_file_sorter)


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

                cpu_val_with_perc = line_as_list[2]
                cpu_val = float(cpu_val_with_perc[:-1])

                mem_val_with_M = line_as_list[3]
                mem_val = float(mem_val_with_M[:-3])

                temp_file['mem'].append(mem_val)
                temp_file['cpu'].append(cpu_val)

        all_extracted_vals[curr_cwd_txt_file] = temp_file

        if '500_points' in curr_cwd_txt_file:
            all_extracted_vals['mem_500'].append(temp_file['mem'])
            all_extracted_vals['cpu_500'].append(temp_file['cpu'])
        elif '1000_points' in curr_cwd_txt_file:
            all_extracted_vals['mem_1000'].append(temp_file['mem'])
            all_extracted_vals['cpu_1000'].append(temp_file['cpu'])

# To be opened later
        # title = curr_cwd_txt_file[:-4]
        # fig, axs = plt.subplots(2, 1, constrained_layout=True)
        # axs[0].plot(range(len(temp_file['mem'])), temp_file['mem'], label='mem')
        # axs[0].set_xlabel('time')
        # axs[0].set_ylabel('memory load')
        # axs[0].set_title(title)

        # axs[1].plot(range(len(temp_file['cpu'])), temp_file['cpu'], label='cpu')
        # axs[1].set_xlabel('time')
        # axs[1].set_ylabel('cpu load')
        # axs[1].set_title(title)
        # plt.savefig(title + '.png')

print(all_extracted_vals)
cpu_means = {'cpu_500': [], 'cpu_1000': []}
mem_means = {'mem_500': [], 'mem_1000': []}

for cpu in ['cpu_500', 'cpu_1000']:
    for curr_req in all_extracted_vals[cpu]:
        mean_curr_req = np.mean(curr_req)
        cpu_means[cpu].append(mean_curr_req)

title = 'CPU'
fig, axs = plt.subplots(2, 1, constrained_layout=True)
axs[0].plot([1, 5, 10, 20, 50], cpu_means['cpu_500'], label='cpu_500')
# axs[0].plot(range(len(cpu_means['cpu_500'])), cpu_means['cpu_500'], label='cpu_500')
axs[0].set_xlabel('# of request')
axs[0].set_ylabel('cpu load')
# axs[0].set_title(title)

axs[1].plot([1, 5, 10, 20, 50], cpu_means['cpu_1000'], label='cpu_1000')
# axs[1].plot(range(len(cpu_means['cpu_1000'])), cpu_means['cpu_1000'], label='cpu_1000')
axs[1].set_xlabel('# of request')
axs[1].set_ylabel('cpu load')
axs[1].set_title(title)
plt.savefig('cpu.png')


for mem in ['mem_500', 'mem_1000']:
    for curr_req in all_extracted_vals[mem]:
        mean_curr_req = np.mean(curr_req)
        mem_means[mem].append(mean_curr_req)

title = 'Memory'
fig, axs = plt.subplots(2, 1, constrained_layout=True)
# axs[0].plot(range(len(mem_means['mem_500'])), mem_means['mem_500'], label='mem_500')
axs[0].plot([1, 5, 10, 20, 50], mem_means['mem_500'], label='mem_500')
axs[0].set_xlabel('# of request')
axs[0].set_ylabel('memory load')
# axs[0].set_title(title)

# axs[1].plot(range(len(mem_means['mem_1000'])), mem_means['mem_1000'], label='mem_1000')
axs[1].plot([1, 5, 10, 20, 50], mem_means['mem_1000'], label='mem_1000')
axs[1].set_xlabel('# of request')
axs[1].set_ylabel('memory load')
axs[1].set_title(title)

plt.legend((axs[0], axs[1]), ('500', '1000'))
plt.savefig('memory.png')


# print('cpu means: ', cpu_means, '\nmem means: ', mem_means)
