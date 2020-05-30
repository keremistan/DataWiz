import os
import json
import numpy as np
from pprint import pprint
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
sns.set(color_codes=True)

def file_name_point_quantity_extractor(el):
    splitted_el = el.split('.')
    data_points = int(splitted_el[0])
    return data_points


def read_data_files():
    all_files = []
    for _, _, file_names in os.walk('.'):
        all_files.append(file_names)

    cwd_all_files = all_files[0]
    cwd_all_txt_files = list(filter(lambda x: '.json' in x, cwd_all_files))
    cwd_all_txt_files = sorted(cwd_all_txt_files, key=file_name_point_quantity_extractor)
    return cwd_all_txt_files


def visualise_render_time(graph_avg_per_category, point_quantites):
    for curr_avg in graph_avg_per_category:
        df = pd.DataFrame({'x': point_quantites, curr_avg: graph_avg_per_category[curr_avg]})
        plt.plot('x', curr_avg, data=df)
        plt.xlabel('Data Batch Size')
        plt.ylabel('Render Time (Ms)')
        plt.legend()
        plt.savefig(curr_avg + '.png')

if __name__ == "__main__":
    data_files = read_data_files()

    point_quantites = [file_name_point_quantity_extractor(x) for x in data_files]
    data_categorized = dict(map(lambda el: (el, {}), point_quantites))
    graphs = ['scatterWithClusters', 'scatterWithRaw', 'parallel_raw_data', 'parallel_cluster', 'overall']
    all_graphs_data = dict()

    for point_quantity in point_quantites:
        temp_graphs_data = dict(map(lambda el: (el, []), graphs))
        with open(str(point_quantity) + '.json') as f:
            curr_file_content = f.read()
            curr_file_content = json.loads(curr_file_content)
            for meas_point in curr_file_content:
                temp_graphs_data[meas_point['id']].append(meas_point['actualDuration'])
        all_graphs_data[point_quantity] = temp_graphs_data
    
    graph_avg_per_category = dict(map(lambda el: (el, []), graphs))
    for graph in graphs:
        for categ_graph_data in all_graphs_data:
            avg_categ_graph_data = np.mean(all_graphs_data[categ_graph_data][graph])
            graph_avg_per_category[graph].append(avg_categ_graph_data)

    visualise_render_time(graph_avg_per_category, point_quantites)
    