---
title: Ex81 使用ASE批量切金属稳定的表面
categories: 
- LVASPTHW
tags: 
- ASE
- 切面
- slab
date: 2019-05-14 15:30:16
---

最近整理材料，发现遗落在角落里的一个python脚本（`cssm.py`），可以批量切常见金属稳定表面的slab模型。 `cssm.py` 是：`cleave_stable_surfaces_from_metals`的缩写。废话不多说，下面是在天河II上运行的实例，大家照着敲一遍应该问题不大。

```bash
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$ ls
cssm.py
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$ python cssm.py
Traceback (most recent call last):
  File "cssm.py", line 3, in <module>
    from ase import Atoms
ImportError: No module named ase
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$ python3 cssm.py
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$ ls
POSCAR_Ag_1           POSCAR_Co_3_bottomed  POSCAR_Fe_3           POSCAR_Ni_2_bottomed  POSCAR_Pt_2           POSCAR_Ru_1_bottomed
POSCAR_Ag_1_bottomed  POSCAR_Cu_1           POSCAR_Fe_3_bottomed  POSCAR_Ni_3           POSCAR_Pt_2_bottomed  POSCAR_Ru_2
POSCAR_Ag_2           POSCAR_Cu_1_bottomed  POSCAR_Ir_1           POSCAR_Ni_3_bottomed  POSCAR_Pt_3           POSCAR_Ru_2_bottomed
POSCAR_Ag_2_bottomed  POSCAR_Cu_2           POSCAR_Ir_1_bottomed  POSCAR_Pd_1           POSCAR_Pt_3_bottomed  POSCAR_Ru_3
POSCAR_Ag_3           POSCAR_Cu_2_bottomed  POSCAR_Ir_2           POSCAR_Pd_1_bottomed  POSCAR_Rh_1           POSCAR_Ru_3_bottomed
POSCAR_Ag_3_bottomed  POSCAR_Cu_3           POSCAR_Ir_2_bottomed  POSCAR_Pd_2           POSCAR_Rh_1_bottomed  cssm.py
POSCAR_Co_1           POSCAR_Cu_3_bottomed  POSCAR_Ir_3           POSCAR_Pd_2_bottomed  POSCAR_Rh_2
POSCAR_Co_1_bottomed  POSCAR_Fe_1           POSCAR_Ir_3_bottomed  POSCAR_Pd_3           POSCAR_Rh_2_bottomed
POSCAR_Co_2           POSCAR_Fe_1_bottomed  POSCAR_Ni_1           POSCAR_Pd_3_bottomed  POSCAR_Rh_3
POSCAR_Co_2_bottomed  POSCAR_Fe_2           POSCAR_Ni_1_bottomed  POSCAR_Pt_1           POSCAR_Rh_3_bottomed
POSCAR_Co_3           POSCAR_Fe_2_bottomed  POSCAR_Ni_2           POSCAR_Pt_1_bottomed  POSCAR_Ru_1
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$ rm *{1..3}
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$ ls
POSCAR_Ag_1_bottomed  POSCAR_Co_3_bottomed  POSCAR_Fe_2_bottomed  POSCAR_Ni_1_bottomed  POSCAR_Pd_3_bottomed  POSCAR_Rh_2_bottomed  cssm.py
POSCAR_Ag_2_bottomed  POSCAR_Cu_1_bottomed  POSCAR_Fe_3_bottomed  POSCAR_Ni_2_bottomed  POSCAR_Pt_1_bottomed  POSCAR_Rh_3_bottomed
POSCAR_Ag_3_bottomed  POSCAR_Cu_2_bottomed  POSCAR_Ir_1_bottomed  POSCAR_Ni_3_bottomed  POSCAR_Pt_2_bottomed  POSCAR_Ru_1_bottomed
POSCAR_Co_1_bottomed  POSCAR_Cu_3_bottomed  POSCAR_Ir_2_bottomed  POSCAR_Pd_1_bottomed  POSCAR_Pt_3_bottomed  POSCAR_Ru_2_bottomed
POSCAR_Co_2_bottomed  POSCAR_Fe_1_bottomed  POSCAR_Ir_3_bottomed  POSCAR_Pd_2_bottomed  POSCAR_Rh_1_bottomed  POSCAR_Ru_3_bottomed
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$  for i in *med*; do mkdir $(echo $i |awk -F "_" '{print $2"_"$3}'); mv $i  $(echo $i |awk -F "_" '{print $2"_"$3}')/POSCAR;  done
iciq-lq@ln3:/THFS/home/iciq-lq/cssm$ ls */*
Ag_1/POSCAR  Co_1/POSCAR  Cu_1/POSCAR  Fe_1/POSCAR  Ir_1/POSCAR  Ni_1/POSCAR  Pd_1/POSCAR  Pt_1/POSCAR  Rh_1/POSCAR  Ru_1/POSCAR
Ag_2/POSCAR  Co_2/POSCAR  Cu_2/POSCAR  Fe_2/POSCAR  Ir_2/POSCAR  Ni_2/POSCAR  Pd_2/POSCAR  Pt_2/POSCAR  Rh_2/POSCAR  Ru_2/POSCAR
Ag_3/POSCAR  Co_3/POSCAR  Cu_3/POSCAR  Fe_3/POSCAR  Ir_3/POSCAR  Ni_3/POSCAR  Pd_3/POSCAR  Pt_3/POSCAR  Rh_3/POSCAR  Ru_3/POSCAR
```

注：直接用`python cssm.py` 会出错，因为默认的是`python2`版本，而ASE基于`python3`，换成`python3 cssm.py`就OK了。

脚本内容: 

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from ase import Atoms
import ase.io 
from ase.build import molecule
from ase.build import bulk 
from ase.build import surface
from ase.build import add_vacuum 
from ase.build import fcc111, bcc110, hcp0001
from ase.constraints import FixAtoms
import subprocess


## Crystal structure of elements: from https://en.wikipedia.org/wiki/Periodic_table_(crystal_structure)
bcc = ['V',  'Cr', 'Mn', 'Fe', 'Nb', 'Pb']
hcp = ['Mg', 'Sc', 'Ti', 'Co', 'Zn', 'Y', 'Zr', 'Tc', 'Ru', 'Cd', 'Hf', 'Re', 'Os']
fcc = ['Al', 'Ca', 'Ni', 'Cu', 'Rh', 'Pd', 'Ag', 'Ir', 'Pt', 'Au']

### Metal  Bulk structures from DFT calculations without vdw 
## {element:[E_bulk, Natom_in_the_bulk, lattice_a, lattice_c]
## 'Bulks are conventional cells, not primitive cells'

dict_metals = { 
'Ag':(-10.88004463,4,4.1423472817),
'Co':(-14.06155869,2,2.4908062578,4.0275560997),
'Cu':(-14.91182926,4,3.6339719976),
'Fe':(-16.47105782,2,2.8346922247),
'Ir':(-35.00402169,4,3.8852086642),
'Ni':(-21.86901226,4,3.5177809803),
'Pd':(-20.864555,4,3.9374172967),
'Pt':(-24.39436715,4,3.9669414218),
'Rh':(-29.10896058,4,3.8241655305),
'Ru':(-18.49439863,2,2.7126893229,4.2897522328),
}

def bottom(file_in):
    '''This function is used to pull the cetered atoms (from ASE) back to the bottom. '''
    f = open(file_in, 'r')
    lines = f.readlines()
    f.close()
    coord = [float(line.rstrip().split()[2]) for line in lines[9:]]
    bottom = min(coord)
    out_put = open(file_in + '_bottomed', 'w')
    out_put.writelines(i for i in lines[0:9])
    for line in lines[9:]:
        infor = line.rstrip().split()
        infor[2] = str(float(infor[2]) - bottom)
        out_put.write('   '.join(infor) + '\n')
    out_put.close()   

def cssm(metal, data_dict):  # cleave_stable_surfaces_from_metals 
    name = 'POSCAR_' + metal
    if metal in bcc:   # For bcc metals, cleave 110 surface 
        lattice_a = float(data_dict.get(metal)[2])
        for i in range(1,4):
            name_out = name + '_' + str(i)
            slab = bcc110(metal, a = lattice_a, size = (i, i, 4), vacuum = 7.5)
            '''(i,i,4) means repeat i i 4 in x y and z directions. vacuum will be 7.5 * 2 because it was added on the two sides.''' 
            constraint_l = FixAtoms(indices=[atom.index for atom in slab if atom.index < i*i*2])
            slab.set_constraint(constraint_l)
            ase.io.write(name_out, slab, format='vasp')    
            ### Add the element line to the POSCAR file ###
            subprocess.call(['sed -i ' + '\'5a' + metal + '\'  ' + name_out], shell = True  )
            bottom(name_out)            
    elif metal in hcp:   # For hcp metals, cleave 0001 surface 
        lattice_a, lattice_c = [float(i) for i in data_dict.get(metal)[2:]]
        for i in range(1,4):
            name_out = name + '_' + str(i)
            slab = hcp0001(metal, a = lattice_a, c = lattice_c, size = (i, i, 4), vacuum = 7.5)
            constraint_l = FixAtoms(indices=[atom.index for atom in slab if atom.index < i*i*2])
            slab.set_constraint(constraint_l)
            ase.io.write(name_out, slab, format='vasp')
            subprocess.call(['sed -i ' + '\'5a' + metal + '\'  ' + name_out], shell = True  )
            bottom(name_out)            
            
    elif metal in fcc:   # For fcc metals, cleave 111 surface
        lattice_a = float(data_dict.get(metal)[2])
        for i in range(1,4):
            name_out = name + '_' + str(i)
            slab = fcc111(metal, a = lattice_a, size = (i, i, 4), vacuum = 7.5)
#            slab.center(vacuum=7.5, axis = 2)
            constraint_l = FixAtoms(indices=[atom.index for atom in slab if atom.index < i*i*2])
            slab.set_constraint(constraint_l)
            ase.io.write(name_out, slab, format='vasp')
            subprocess.call(['sed -i ' + '\'5a' + metal + '\'  ' + name_out], shell = True  )
            bottom(name_out)            
    else: 
        print('Please add your element in the crystal structure lists: bcc, hcp, and fcc')  
        
for metal in dict_metals.keys():
    cssm(metal, dict_metals)

```

简单介绍:

首先声明：最近很忙，没时间写脚本的详解， 如果已经安装ASE的或者有天河II号账号的，可以直接试试，如果不行，自己慢慢琢磨；如果不愿意琢磨，那么就按照前面练习中的笨方法用Material Studio切面。下面以`Ag`为例：

`dict_metals` 这个字典里面是本人计算的一些常见金属的bulk晶格常数，能量，bulk中原子数目等信息；仅供大家消遣，测试。如果你要通过这个脚本切用于发表文章的slab，运行前，先自己优化一遍bulk，然后修改成自己的结果再运行。

1）`POSCAR_Ag_1`， `POSCAR_Ag_2`，`POSCAR_Ag_3` 分别是`1x1`,`2x2`, `3x3`的slab模型。

2）ASE默认把结构放在slab的中心，加真空层的时候也是在两侧加，因此脚本里面是7.5$\AA$，对应15$\AA$；

3） 

```python
slab = fcc111(metal, a = lattice_a, size = (i, i, 4), vacuum = 7.5)
```

 是切面的关键行；也是脚本的核心部分；

4）每个`slab`有4层，如果想切厚点，修改 `size = (i, i, 4)`中的4换成为你想要的层数。如果想切（5x5)，4层的`slab`，将前面一行的`for i in range(1,4)`改成`for i in range(1,6)`；

5) 通过

```python
constraint_l = FixAtoms(indices=[atom.index for atom in slab if atom.index < i*i*2])
slab.set_constraint(constraint_l)
```

 把`slab`的`top 2` 层放开；

6）

```
ase.io.write(name_out, slab, format='vasp') 
```

是通过ASE将结构输出到`vasp`的格式。

7）ASE的输出一般没有元素行，脚本里面自动加上了：

```
subprocess.call(['sed -i ' + '\'5a' + metal + '\'  ' + name_out], shell = True)
```

8）`bottom(name_out) ` 功能是把模型从中心拽到底部，输出的结果是`POSCAR_Ag_1_bottomed``，POSCAR_Ag_2_bottomed`，`POSCAR_Ag_3_bottomed`。（个人不喜欢ASE把结构放在中间）

9) 脚本感觉有些啰嗦，欢迎有兴趣的人改进，让它变得更加简洁易懂。

10）最后的bash命令，将所有的`bottomed`归类到各自对应的文件夹中,喜欢把模型放在中间的，可以不用运行`bottom`那个命令。

11）期待我们中国的大牛们写出比ASE更好的软件包出来，安利一波：有问题首先尝试`VASPKIT`。
