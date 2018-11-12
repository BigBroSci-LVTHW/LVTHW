---
title: Ex1 VASP基本输入文件的准备（小结）
categories: 
- LVASPTHW
tags: 
- VASP 输入文件
date: 2018-10-19 15:30:16
---



通过本节（Ex01）的学习，大家初步了解VASP四个主要输入文件的是怎么制作的，一些简单参数的含义，以及每个文件所对应的格式和细节。本节我们分成了很多小节，每节内容都很多，但对新手来说，信息量可能有些大。但不需要一次性全部掌握，因为在后面的学习中，我们会逐渐深入。自己在课题进行的过程中，也会加深自己的理解。但书中要求掌握的部分，必须要牢牢记住。

本书的名字为：The Hard Way。意思是，学习VASP并不是一蹴而就的，需要一个长时间的积累过程。所以，新手切勿急躁，很多内容看不懂不要紧，务必要静下心来浏览一遍，自己跟着说明亲自去实践，切不可复制粘贴。 本节所讲解的东西，都务必去VASP官网找对应的说明，认真阅读，反复思考。养成潜心学习官网教程的良好习惯，从而远离网络上那些错误的信息。尤其是对于新手来说，很多都不懂的时候，没有自己的主见，别人一说就被牵着鼻子走了。

**相关的参考资料：**

1. Vim使用练习：自己搜资料学习，百度里面很多，学会怎么输入，保存。
2. VASP文件: http://cms.mpi.univie.ac.at/vasp/guide/node50.html

3. INCAR:    http://cms.mpi.univie.ac.at/vasp/guide/node91.html

4. KPOINTS1:   http://cms.mpi.univie.ac.at/vasp/guide/node55.html

5. KPOINTS2:  https://cms.mpi.univie.ac.at/vasp/vasp/Automatic_k_mesh_generation.html
6. POSCAR1:   http://cms.mpi.univie.ac.at/vasp/guide/node59.html
7. POSCAR2:  https://cms.mpi.univie.ac.at/vasp/vasp/POSCAR_file.html
8. POTCAR1:   http://cms.mpi.univie.ac.at/vasp/guide/node54.html
9. POTCAR2:   https://cms.mpi.univie.ac.at/vasp/vasp/Recommended_PAW_potentials_DFT_calculations_using_vasp_5_2.html
10. ISMEAR1:   http://cms.mpi.univie.ac.at/vasp/guide/node124.html
11. ISMEAR2:   http://cms.mpi.univie.ac.at/vasp/vasp/Number_k_points_method_smearing.html

