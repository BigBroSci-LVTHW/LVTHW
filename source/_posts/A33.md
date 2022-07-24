---
title: A33 利用matminer和pymatgen获取material project结构 
categories: 
- pymatgen
tags: 
- matminer 
- cif
- pymatgen
date: 2022-06-23 15:30:16
---

# 首先导入模块
from matminer.data_retrieval.retrieve_MP import MPDataRetrieval
# 实例化 MPDataRetrieval 这个类
mpdr = MPDataRetrieval(api_key='qIAww9QnUnXQJO41')   # 自行查阅自己的api_key
# 在实例化 MPDataRetrieval 时需要输入用户在 Material Project 网站的“” API Key.

df = mpdr.get_dataframe(criteria={"nelements": 1,
                                  "elements": {"$in": ["Cu"]}},
                        properties=['pretty_formula','cif'])
print("There are {} entries on MP with 2 element".format(df['pretty_formula'].count())) # 计算有多少材料
#请自行关注 df['density'].count() 语句，获取Cu金属的各种结构

# 导入pymatgen.ext.matproj下的MPRester模块
from pymatgen.ext.matproj import MPRester

# 实例化 MPRester 这个类
mpr = MPRester(api_key="XXX")  # 自行查阅自己的api_key，替换XXX。

# 获取Cu金属某一结构文件
data_structure=mpr.get_structure_by_material_id('mp-1009018')

# 利用pymatgen.io.cif下的CifWriter模块导出Cu.cif文件
from pymatgen.io.cif import CifWriter
w = CifWriter(data_structure)
w.write_file('Cu.cif')

![](A33/qr_a33.jpeg)

