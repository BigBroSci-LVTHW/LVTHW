---
title: ASE的安装
date: 2019-03-22 02:06:48
tags: 
- ASE
- Windows
- UBUNTU
category:
- LVASPTHW附录
---

#### 什么是ASE？

ASE 是Atomic Simulation Environment的简称。详细的介绍大家可以浏览官网：https://wiki.fysik.dtu.dk/ase/about.html。ASE是一个基于python的程序库，可以做的事情很多，不同程序任务的设置，结构的搭建，结构分析都可以做。

#### 为什么用ASE？

* ASE里面包含了很多的功能，其中个人认为最为方便地就是计算模型不同文件类型的转换。比如将cif文件转化为POSCAR，将POSCAR转化为xyz文件，等等；

* 可以在学习ASE的时候，顺便学习python的一些知识；

* 使用ASE分析计算结果；
* 使用ASE学习做计算；这里分享`江山`推荐的一本书：https://github.com/jkitchin/dft-book

#### 怎么安装ASE？

如果你用的是国防科大吕梁超算中心，管理员已经安装好了ASE，那么需要你做的只有一步，添加ASE的路径到`.bashrc`文件中就可以直接用了。

```bash
iciq-lq@ln3:/THFS/opt/python3.6/bin$ ls ase*
ase  ase-build  ase-db  ase-gui  ase-info  ase-run
iciq-lq@ln3:/THFS/opt/python3.6/bin$ pwd
/THFS/opt/python3.6/bin
iciq-lq@ln3:/THFS/opt/python3.6/bin$ tail -n 1 ~/.bashrc
export PATH=$PATH:/THFS/opt/python3.6/bin
```

如果你想在自己电脑上安装ASE。安装过程很简单，详细的信息请参考：https://wiki.fysik.dtu.dk/ase/install.html。Mac太贵，没尝试过，Windows系统本人不太熟悉，下面附上在Windows10中Ubuntu寄生系统的安装过程（跟正儿八经Ubuntu系统的安装流程一样）； 总共就三步。

* 安装pip：如果已经安装了pip，则就剩2步了。![](C:\Users\lqlhz\OneDrive\桌面\1.png)

* 安装ASE：

  ![](C:\Users\lqlhz\OneDrive\桌面\2.png)

* 添加ASE的路径到`.bashrc`文件。

```bash
export PATH=$PATH:/home/bigbro/.local/bin
```

在Terminal里面输入`ase`，然后摁下`tab`键：如果跟下面的输出一样，说明八九不离十了。

```bash
bigbro@DESKTOP-S6R3TUP:~$ ase
ase             ase-build       ase-db          ase-gui         ase-info        ase-run         ase_figures.sh  aselite.py      aselite.pyc
bigbro@DESKTOP-S6R3TUP:~$ ase --version
ase-3.17.0
```

