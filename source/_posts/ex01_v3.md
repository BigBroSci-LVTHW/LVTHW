---
title: Ex01_V3 学习VASP的基本要求
date: 2022-07-23 03:06:48
categories: 
- LVASPTHW
---

###### 在学习本书时，大师兄们会默认读者掌握了一些基本的电脑操作技能，以及化学的基本常识（结构化学，物理化学等）。本章列举出一些常用的计算工具和软件，以及假设大家掌握的一些技能。如果没有达到基本的要求，那么请在学习前面几章的同时，抓紧提升自己的能力。 化学的基本知识如果没有掌握，不建议学习本书。 




## 1  **操作系统**

做计算，有三个操作系统可以选择：

- Windows 系统：会使用Windows系统:会开机，打字，安装软件;
- Linux 系统，强烈推荐，大师兄本人一直用的是Ubuntu，但不局限于Ubuntu系统，自己喜欢什么就用什么。

- Mac系统，兼顾Windows和Linux，一般比较贵，经济条件允许，也可以。


##### 给重点照顾对象：Windows用户的第一个提醒：

Windows用户在进行计算的时候，只要计算出错了，就要本能地记起第一个解决的办法： dos2unix 。 这个命令干什么的不要紧，先死死记住即可。



## 2 **文本编辑工具**

文本编辑工具主要用来编辑，查看VASP的输入（出）文件，要求会打开文件，打字，保存文件。

### 1）[vim](https://www.vim.org/) 

这个**必须要学会**，linux下面自带。原因是绝大多数的计算都是在linux下面进行的，学会vim的基本操作可以极大提高你的文字处理能力和工作效率。关于VIM的使用介绍，自己百度下或者搜一搜相关的视频，学习下。



### 2) [notepad++](https://notepad-plus-plus.org/)

* 这个是对于Windows用户来说的，要求会创建文件，输入内容并保存文件，**这个软件或者类似的必须学会使用!**

原因在于：Windows下面自带的记事本保存的文件与linux下的文件格式不匹配，提交任务的时候经常出问题，用notepad++则不会出现这个问题。

**因此**，Windows的记事本杜绝使用。为了安全，即使用了notepad++，Windows用户在进行计算的时候，也需要注意下面两点：

* Windows下面编辑的输入文件，如果想在linux服务器上运行，最好先执行: dos2unix 这个命令。

  ```bash
  dos2unix  INCAR
  ```

* Windows用户计算出错了，一定要首先想到 dos2linux 这个命令来解决问题!!!


### 3） [Atom](https://atom.io/)

这个Atom是文本编辑工具，不是原子的意思。Windows，Linux，Mac系统均可使用。



## 3 **常用建模相关软件:**

本书默认大家已经在自己的电脑里安装了下面三个软件：

### **1) Material Studio** 

* 这个软件，百度里面一大堆下载链接，安装教程，大家自行下载安装即可。
*  本书默认大家已经安装成功，会不会使用暂且不要求；
* 不要问我从哪里下载，安装出现问题也不要找我解决。
* 另外，MS很贵，国内大部分人都是用的盗版软件，没有版权，不建议使用。

### 2）**[VESTA](http://jp-minerals.org/vesta/en/)**  

来自日本的良心软件，Linux，Windows，Mac系统均可使用。链接：http://jp-minerals.org/vesta/en/。无版权困扰，发文章的时候要注明下图是用VESTA做的，引用下对应的文章。

* Windows下面安装就不再介绍了，下载程序，解压，双击图标即可运行，相信大家都能搞定。

* Linux下安装: 

  - 下载binary程序文件，本人解压后放到了/opt/VESTA-x86_64目录

  - 编辑 ~/.bashrc 文件，在文件最后，添加下面2行。

  ```
  export VESTA=/opt/VESTA-x86_64 
  export PATH="$PATH:$VESTA"
  ```

  - 在终端里面进行的操作如下：第一行打开~/.bashrc文件, 自己添加上面提到的两行即可，第二行更新下~/bashrc文件，第三行运行VESTA。

  ```
  $ vim ~/.bashrc
  $ . ~/.bashrc
  $ VESTA
  ```

### 3）[**p4vasp**](http://www.p4vasp.at)

p4vasp主要有建模，可视化以及后处理的一些功能。

* 链接：[http://www.p4vasp.at/](http://www.p4vasp.at/)

- Windows版本，很久没有更新了，点击此处下载，解压,双击图标即可运行。也可以在大师兄QQ群或者其他QQ群文件中下载。

- Linux版本功能更加强大。也很久没更新了。 Ubuntu（18以及更老的版本）用户使用命令一键安装： **sudo apt-get install p4vasp**

  Ubuntu 20以及后续的安装有些麻烦。p4vasp已经不更新了，很多功能可以用其他的软件替代。如果坚持使用p4vasp，可以联系大师兄付费安装（50块钱）。

### 4） [ASE](https://wiki.fysik.dtu.dk/ase/index.html)

ASE 是Atomic Simulation Environment的缩写，可以实现搭建结构，读取VASP的输入和输出，以及一些后处理功能。如果p4vasp没办法安装，那么ASE必须要安装在你的电脑上。

### 5）其他软件

这里说的软件主要是针对VASP计算的模型搭建这一方面，有兴趣的也可以试试[Avogadro](https://avogadro.cc). 值得一提的是，我们自己的国产建模软件那是相当得少，更别提计算软件了。而我们比较擅长的是写教程和后处理，然后发公众号割韭菜。





## **总结:** 

* 初学者学习本书,所必须具有的技能:
* - 熟练使用一个操作系统；
  - 会编辑文本，写入和保存文件；
  - - **Windows 用户Notepad++必须掌握**,
    - linux用户可以vim或者其他编辑器，比如Atom
  - 安装好或者会初步使用一款建模软件。-
    - **p4vasp **，**ASE**安装在Windows和Ubuntu系统上；
    - **VESTA** 安装在Windows，Ubuntu，Mac系统上；
    - **Materials Studio** 安装在Windows上（没版权就别安装了）
  - 会连接服务器，使用的vasp程序并且会提交任务
    - 这个大师兄帮不了你，找师兄师姐，到时、自行找服务器商或者其他售后人员解决。
