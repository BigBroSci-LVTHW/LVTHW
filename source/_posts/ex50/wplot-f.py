#!/usr/bin/env python
# Written By Qiang for workfunction Visualization from VLINE file

import matplotlib.pyplot as plt

x = []
y = []
with open("VLINE", mode='r') as f:
    next(f)
    for line in f:
        xy=line.rstrip().split()
        x.append(float(xy[0]))
        y.append(float(xy[1]))

plt.plot(x,y) 
plt.savefig('workfunction' + '.pdf', dpi=400)
plt.show()
