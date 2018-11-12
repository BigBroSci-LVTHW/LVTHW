---
title: Ex05 VASP任务的提交
categories: 
- LVASPTHW
tags: 
- 吕梁
- 超算中心
- 天河二号
date: 2018-10-26 15:30:16
---



前面我们已经准备好了VASP的四个输入文件，学习了一系列的批量操作，那么该如何让vasp 算起来呢？每个课题组都会有自己不同的任务提交系统，大家可以向自己的师兄师姐学习提交任务的方法。此外，超算中心也是大家经常接触到的，本节通过吕梁超算中心资源（天河二号）的计算平台，介绍下具体的提交方法，任务的查看等基本操作。



### 任务提交

首先通过下面的命令，浏览一下具体的提交流程：

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ ls
ex01  ex02  ex03  ex04
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ cp ex03/0.01 ex05
cp: omitting directory `ex03/0.01'
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ cp ex03/0.01 ex05 -r 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ cd ex05/
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ ls
INCAR  KPOINTS  POSCAR  POTCAR
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ cp ~/bin/job_check/job_sub  .
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ cat job_sub 
#!/bin/bash
export LD_LIBRARY_PATH=/THFS/opt/intel/composer_xe_2013_sp1.3.174/mkl/lib/intel64:$LD_LIBRARY_PATH
yhrun -p gsc -n 24 /THFS/opt/vasp/5.4.4/vasp.5.4.4/bin/vasp_std 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ yhbatch -p gsc -N 1 -J test job_sub 
Submitted batch job 983800

```

解释：

* 提交任务的脚本，为~/bin/job_check目录下的job_sub文件。 脚本名字大家随便起，目录可以随便放，只要用的时候能保证找到即可。

  - 脚本里面指定了一些库的位置
  - 使用的队列：这里是gsc，具体以自己购买的为准
  - -n 24 是指定每个节点的核数

* 提交任务的命令为： 

  ```
  yhbatch -p gsc -N 1 -J test job_sub 
  ```

  这里大家需要修改的主要有下面几个地方：

  * gsc 是你计算的队列，这个在购买机时的时候，超算管理员会告诉你用哪个队列；对应的写上就可；
  * -N 后面的1是我们所用节点的个数，一个节点24个核（脚本里面已经指定了）
  * test是计算的任务名字，这个大家随便起；以第一眼能通过这个名字能辨别出是什么任务为佳；
  * job_sub就是脚本名，如果你把job_sub改成bigbro了，那么上面的命令行中，job_sub就需要改成bigbro了。

* 网上也有很多实用的教程，大家可以多多浏览，比如： [天河二号简明使用手册](https://github.com/JiangLiNSCC/TH2-demos/wiki/%E5%A4%A9%E6%B2%B3%E4%BA%8C%E5%8F%B7%E7%AE%80%E6%98%8E%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C)；也可以在超算的使用QQ群中交流，比如：国防科大吕梁超算中心QQ群：**204521798**。

 

### 任务查看



```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ ls
CHG  CHGCAR  CONTCAR  DOSCAR  EIGENVAL  IBZKPT  INCAR  job_sub  KPOINTS  OSZICAR  OUTCAR  PCDAT  POSCAR  POTCAR  REPORT  slurm-983800.out  vasprun.xml  WAVECAR  XDATCAR
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ yhq
             JOBID    PARTITION                       NAME             USER ST       TIME  NODES NODELIST(REASON)
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ tail OUTCAR
                            User time (sec):        1.991
                          System time (sec):        3.501
                         Elapsed time (sec):        5.931

                   Maximum memory used (kb):      104300.
                   Average memory used (kb):           0.

                          Minor page faults:         8571
                          Major page faults:            0
                 Voluntary context switches:         3090
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$

```

* 在上面的操作中，我们使用ls命令，发现目录下多了一堆文件出来，这说明任务运行了。前面已经给大家提了个醒，这些文件大部分都没用，所以不用被它们所吓倒，我们后面会一一解释。

* 由于只有一个O原子，任务很快就算完了。所以使用yhq这个命令查看运行状态时，也就得不到结果了。
* 判断一个任务是否算完，通过一个tail命令就可以完成。如果你发现和上面命令类似的结果，就说明任务算完了。

* 这里tail的命令用来输出某个文件最后的几行，如果想输出文件最前面的几行（通过-n 来实现），可以使用head文件，简单的操作实例如下，自己百度学习下其他相关的用法，熟练掌握。大师兄就不再啰嗦了。

  ```
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ tail -n 5 OUTCAR
                     Average memory used (kb):           0.
  
                            Minor page faults:         8571
                            Major page faults:            0
                   Voluntary context switches:         3090
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ head -n 6 OUTCAR
   vasp.5.4.4.18Apr17-6-g9f103f2a35 (build Sep 22 2017 10:53:27) complex
  
   executed on             LinuxIFC date 2018.11.12  03:58:57
   running on   24 total cores
   distrk:  each k-point on   24 cores,    1 groups
   distr:  one band on NCORES_PER_BAND=   1 cores,   24 groups
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ tail -n 5 OUTCAR | head -n 2
                     Average memory used (kb):           0.
  
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$
  
  ```



### 总结

本节我们通过超算中心简单展示了VASP任务的提交过程，本节需要掌握的内容主要有：

* 会提交任务；
* 会查看任务；
* 知道VASP任务结束后，怎么通过tail命令判断。
* 学会使用：tail 和 head 这2个命令。