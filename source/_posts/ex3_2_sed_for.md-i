---
title: Ex03 做计算常用的批量处理方法（四）
categories: 
- LVASPTHW
tags: 
- for 循环
- 批量处理
- sed
date: 2018-10-23 15:30:16
---



本节我们学习2个批量操作：

* 通过sed单个命令进行批量操作
* 以及sed + for循环的批量操作



1  sed 批量将0.01到0.09中所有INCAR中的0.01替换成0.05。到现在为止，相信大家都可以看懂下面的命令操作。就不再啰嗦解释了。有一点需要注意的是grep 命令中的星号，检查输入输出的时候用*非常方便。

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ ls
0.01
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ for i in {2..9}; do cp 0.01 0.0$i -r ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ ls 
0.01  0.02  0.03  0.04  0.05  0.06  0.07  0.08  0.09
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ grep SIGMA */INCAR
0.01/INCAR:SIGMA = 0.01
0.02/INCAR:SIGMA = 0.01
0.03/INCAR:SIGMA = 0.01
0.04/INCAR:SIGMA = 0.01
0.05/INCAR:SIGMA = 0.01
0.06/INCAR:SIGMA = 0.01
0.07/INCAR:SIGMA = 0.01
0.08/INCAR:SIGMA = 0.01
0.09/INCAR:SIGMA = 0.01
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ sed -i '3s/0.01/0.05/g' */INCAR
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ grep SIGMA */INCAR
0.01/INCAR:SIGMA = 0.05
0.02/INCAR:SIGMA = 0.05
0.03/INCAR:SIGMA = 0.05
0.04/INCAR:SIGMA = 0.05
0.05/INCAR:SIGMA = 0.05
0.06/INCAR:SIGMA = 0.05
0.07/INCAR:SIGMA = 0.05
0.08/INCAR:SIGMA = 0.05
0.09/INCAR:SIGMA = 0.05
```



2 for 循环结合sed 

前面我们使用sed命令，将文件夹中所有的0.01替换成了0.05。但我们的目标是，每个文件夹中的SIGMA值与文件夹相同。既然我们知道了sed可以对单个文件进行操作，那么我们也可以结合for循环，来实现一个批量操作的目的。命令如下：

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ ls
0.01  0.02  0.03  0.04  0.05  0.06  0.07  0.08  0.09
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ for i in *; do sed -i "3s/0.05/$i/g" $i/INCAR ; done  
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ grep SIGMA */INCAR
0.01/INCAR:SIGMA = 0.01
0.02/INCAR:SIGMA = 0.02
0.03/INCAR:SIGMA = 0.03
0.04/INCAR:SIGMA = 0.04
0.05/INCAR:SIGMA = 0.05
0.06/INCAR:SIGMA = 0.06
0.07/INCAR:SIGMA = 0.07
0.08/INCAR:SIGMA = 0.08
0.09/INCAR:SIGMA = 0.09

```

**注意：**

* 这里我们用的是双引号 " " ，sed 命令中你会见到大部分都用单引号 ' ' 。但如果这里使用单引号，则所有的 0.01 都会被替换成 $i (单引号中的$i 是纯字符)，因为单引号中的所有内容都会被当做字符来处理，也就是里面是什么就输出什么。使用双引号，则可以读取变量 $i 的值，下面的例子大家一看就知道怎么回事了:

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ abc=bigbro
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ echo abc
abc
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ echo '$abc'
$abc
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ echo $abc
bigbro
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03$ echo "$abc"
bigbro
```

这里单引号中的内容被原封不动地打印出来了。而双引号的话，则可以顺利地把变量调用起来。

* for i in *;  这里的 * 指的是当前目录下所有的文件以及文件夹，本例中没有文件，只有从0.01， 0.02， 0.03 到 0.09 的文件夹；所以： for i in  *  =   for i in 0.01  0.02 0.03  0.04  0.05 0.06  0.07  0.08 0.09

1.5.2 使用sed 命令将INCAR中的 0.05 (所有文件夹中的都是0.05)替换成文件夹的数字;  

```
sed -i "3s/0.05/$i/g" $i/INCAR 
```

当$i的值为0.01的时候，我们就把0.01/INCAR中的0.05替换为0.01；为0.02的时候，就把0.02/INCAR中的0.05替换为0.02，依次类推，直至for循环完成。

1.6 该命令瞬间运行完成，我们使用grep SIGMA 来查看下这些文件夹中的INCAR参数 ，圆满完成任务!

------



### 总结

在ex03的练习中，我们并不着急去提交任务，反正已经走了计算的路，以后提交任务的机会还多着呢，也不差这一两天的学习时间。先从简单到复杂些，逐渐掌握Linux的一节操作命令，对以后的学习帮助很大。

1) 学会 man command 或者 command –help 查看命令的具体参数;

2) 大量使用sed 命令进行操作练习;

3) 知道 * 在for循环中代表的含义

3) 熟知单引号和双引号的使用，以及区别

4) 主动搜索相关的Linux命令的相关知识，积极操练。

5) 学会从单一操作，通过for循环转化成批量操作的思路。

* for i in XXX; do YYY; done 
* XXX就是我们要操作的范围或者对象
* YYY就是单一的一个操作。