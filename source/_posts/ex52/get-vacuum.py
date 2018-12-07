#!/usr/bin/env python

# Welcome to visit our website: www.bigbrosci.com to get more useful information.
 
'''
Written By Qiang 
This script has two functions:
 1) workfunction Visualization from LOCPOT_Z file
 2) Roughly estimate the Vaccum Energy

Please Contact qli@bigbrosci.com if you have questions.

Note1: Read POSCAR with Cartesian coordinations! 
  This means 
  1) you have to convet the direct to cartesian firstly 
  2) otherwise you will get an error.

Note2: Read LOCPOT_Z to plot the figure and calculate the vaccum energy
  This means 
  1)1you have to run command:  work.py LOCPOT z firstly to get the LOCPOT_Z file before use this script

Note3: the idea to calculate the vaccum energy is following:
  1) get the middle z value in the plateau: 
     middle z value = ( coordination of the highest atom + length of the slab in z direction) / 2 
  2) selecte the area to calculate the vaccum energy: 
     from  (middle z  value - 1) to (middle z value + 1)  unit is in angstrom 
  3) do the average of all points y direction.

Note 4: this is only a rough estimation but useful.

Note 5: Check the figure firstly and then use the numbers calculated from this script. 
  1) If the midlle z value is far from the plateau in the figure, you have to calculate the energy by hand.

'''

import matplotlib.pyplot as plt
import numpy as np 
x = []
y = []
dic = {}
with open("LOCPOT_Z", mode='r') as f:
    first_line = f.readline()
    name_x = first_line.split()[1]
    name_y = first_line.split()[2]
    for line in f:
        xy=line.rstrip().split()
        x.append(float(xy[0]))
        y.append(float(xy[1]))
        dic.update({xy[0]:xy[1]})
plt.plot(x,y) 
plt.xlabel(name_x) 
plt.ylabel(name_y) 
plt.savefig('workfunction' + '.pdf', dpi=400)
plt.show()

#%%%%%%%%%%%%%%%%%%%%%%#
# Get the Vaccum Energy
#%%%%%%%%%%%%%%%%%%%%%%#

# Get the total line numbers of POSCAR 
num_lines = sum(1 for line in open('POSCAR'))

# Read POSCAR 
pos = open('POSCAR', mode = 'r')
line = pos.readlines()

# Get  the  slab length in z direction 
vaccum = float(line[4].split()[2])

# Get all atoms' coordination in z direction and store them in the list
z_list = []
for i in range(9, num_lines): 
    z_list.append(float(line[i].split()[2]))

#  max(z_list) is highest atoms' coordination in z direction
# Get the vaccum lenth: 
l_vaccum = vaccum - max(z_list)
print 'The Vaccum in this calculation is:\t\t %s'  %(l_vaccum)

# Choose the middle z value in the workfuntion.pdf 
num_middle = (max(z_list) + vaccum) / 2 
#print num_middle

middle_y = []

for i in dic.keys():
    i = float(i)
# Select the date area within 1 angstrom from the middle point:
    if i > num_middle -1 and i <  num_middle + 1:
        middle_y.append(float(dic.get(str(i))))
# Get the average value in the selected area
print 'The Vaccum Energy in this calculation is:\t %s'  %(np.mean(middle_y))

pos.close()
