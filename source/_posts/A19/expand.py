#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Oct  2 10:54:36 2019

@author: qli
"""
import sys, os
import ase.io.vasp

file_read = sys.argv[1]
x,y,z     = [int(i) for i in sys.argv[2:5]]
try:
    cell = ase.io.vasp.read_vasp("CONTCAR")
    ase.io.vasp.write_vasp("POSCAR",cell*(x, y, z), direct=True,sort=True)
except:
    print(os.getcwd())

