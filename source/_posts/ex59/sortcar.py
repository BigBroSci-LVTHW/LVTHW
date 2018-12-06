#!/usr/bin/env python 
from collections import defaultdict
import numpy as np
import sys 

in_file = sys.argv[1]

### READ input file ###
def read_inputcar(in_file):
    f = open(in_file, 'r')
    lines = f.readlines()
    f.close()
    ele_name  = lines[5].strip().split()
    ele_num = [int(i) for i in lines[6].strip().split()]
    dict_contcar =  {ele_name[i]:ele_num[i] for i in range(0, len(ele_name))} 
    dict_contcar2 = defaultdict(list)
    for element in ele_name: 
        indice  = ele_name.index(element)
        n_start = sum(ele_num[i] for i in range(0, indice+1)) - dict_contcar.get(element) +1
        n_end = sum(ele_num[i] for i in range(0, indice+1)) +1
        dict_contcar2[element].append(range(n_start, n_end)) 
    return lines, ele_name, ele_num, dict_contcar2, dict_contcar

def get_elements(ele):
    lines, ele_name, ele_num, dict_contcar2, dict_contar = read_inputcar(in_file)
    coord_total = []
    my_list = []
    my_dict = {}
    for j in dict_contcar2.get(ele)[0]:
        coord_list = lines[j+8].strip().split()[0:3]
        tf_list = lines[j+8].strip().split()[3:]
        my_list.append(coord_list)
        dict_key = '-'.join(coord_list)
        my_dict[dict_key] = tf_list
       
    data = np.array(my_list)
    data=data[np.argsort(data[:,2])]

    for k in data:
         coord = '  '.join(k)
         tf = '  '.join(my_dict.get('-'.join(k)))
         coord_total.append(coord + '  ' + tf )
    return coord_total

## Generate the New POSCAR file

def Get_and_Save_lines(file_name, start_line, end_line):
    f = open(file_name)
    lines =  f.readlines()
    for line in lines[int(start_line):int(end_line)]:
        file_out.write(line.rstrip()+'\n')

out_name = in_file + '_sorted'
file_out = open(out_name, 'w')
Get_and_Save_lines(in_file, 0, 9)

ele_name = read_inputcar(in_file)[1]
dict_contcar = read_inputcar(in_file)[-1]

for i in ele_name:
    if dict_contcar.get(i) > 1 :
        file_out.write('\n'.join(get_elements(i)))
    else: 
        file_out.write('\n %s \n' %('  '.join(get_elements(i))))
