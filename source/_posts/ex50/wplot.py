#!/usr/bin/env python
# Written By Qiang for workfunction Visualization from LOCPOT_Z file

import matplotlib.pyplot as plt

x = []
y = []
with open("LOCPOT_Z", mode='r') as f:
    first_line = f.readline()
    name_x = first_line.split()[1]
    name_y = first_line.split()[2]
    for line in f:
        xy=line.rstrip().split()
        x.append(float(xy[0]))
        y.append(float(xy[1]))

plt.plot(x,y) 
plt.xlabel(name_x) 
plt.ylabel(name_y) 
plt.savefig('workfunction' + '.pdf', dpi=400)
plt.show()
