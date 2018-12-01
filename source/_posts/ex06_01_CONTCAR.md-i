---
title: Ex06 VASP的输出文件（一）
categories: 
- LVASPTHW
tags: 
- CONTCAR
- 续算
date: 2018-10-27 15:30:16
---

上一节，我们在天河II号顺利提交了VASP的计算，并看到了一堆的输出文件。我们就从简单的开始，一步一步给大家介绍VASP的输出文件，以及里面的细节部分。由于大家还处在一个刚刚接触VASP的阶段。我们先根据目前的计算，挑容易的，重要的进行介绍。最简单的非`CONTCAR`莫属了。



### `CONTCAR` 和 `POSCAR`的区别

在VASP的输入文件中，我们用`POSCAR`来存储模型的结构信息。当我们使用VASP优化完成之后，就会得到一个新的结构，而`CONTCAR`就是用来存储新结构的文件。当然啦，我们这里只有一个O原子，不存在优化这一说法，但VASP只要算上了，就会有CONTCAR出现，不优化的的结果就是：`CONTCAR`和`POSCAR`的结构是一模一样的。但`CONTCAR`和`POSCAR`里面的内容可以一样，也可以不一样。在这里，大师兄把自己的个人经验都写在里面，新手看不懂的话不要紧，先记住这里有`CONTCAR`的相关注意信息，以后用的时候过来直接看即可。如下：

```bash
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ cat -n POSCAR 
     1	O atom in a box 
     2	1.0            
     3	8.0 0.0 0.0   
     4	0.0 8.0 0.0  
     5	0.0 0.0 8.0 
     6	O          
     7	1         
     8	Cartesian
     9	0 0 0           #
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ cat -n CONTCAR 
     1	O atom in a box                         
     2	   1.00000000000000     
     3	     8.0000000000000000    0.0000000000000000    0.0000000000000000
     4	     0.0000000000000000    8.0000000000000000    0.0000000000000000
     5	     0.0000000000000000    0.0000000000000000    8.0000000000000000
     6	   O 
     7	     1
     8	Direct
     9	  0.0000000000000000  0.0000000000000000  0.0000000000000000
    10	 
    11	  0.00000000E+00  0.00000000E+00  0.00000000E+00
```

对于当前的这个例子来说，主要的不同点在于：

* 坐标的小数点位数。对比`POSCAR`和`CONTCAR`中：第1-5、9行的内容。
* 缩进部分：
  * `POSCAR`中，我们每一行都是顶格写的。
  * `CONTCAR`中，从第二行开始，每一行的开头部分都是以空格开始的。此时，就必须要给大家强调一点：`CONTCAR`中开头的是空格，不是tab。第3-5行，你别看前面都空了那么多，都是一个个的空格，而不是tab。
  * 这个一定要死死记住：`CONTCAR`或者`POSCAR`中，每一行中只有空格可以用来分割不同的内容或者开头，绝对不要用tab。否则你任务出错，花很多天都不一定能检查出来这个原因。
* 体系的坐标系也发生了变化： 第8行。`POSCAR`中，我们使用的是笛卡尔坐标系，也就是**Cartesian**或者任何以大写的`C`，小写的`c`开头。但`CONTCAR`中则变成了分数坐标系，也就是**Direct**。 这个给我们的启示就是：
  * 如果想把体系从**Cartesian**转化为**Direct**，我们可以算一个单点。（单点的意思不明白，不要紧，后面我们会介绍）
  * 我们的`POSCAR`可以使用**Cartesian**， 也可以使用**Direct**，这个看大家自己的习惯。本人喜欢用**Cartesian**，看起来更加直观一些。
  * 由于我们的`O`原子在坐标系的原点（0,0,0）的位置，所以**Direct**和**Cartesian**看不出来区别。
* 在`CONTCAR`中，还多了一行内容（第11行），这一行主要描述的是体系中原子在xyz三个方向移动相关的信息。因为我们体系只有一个原子，所以也就只多了一行。
  * 以后当你在优化结构的时候，体系中有多少原子，就会多出多少行出来，但全部都是0。
  * 如果你跑的是分子动力学，那么这些行中就不是0了，代表的是分子移动的速度
  * 如果你用`dimer`方法算过渡态的时候，那么这些行中是与过渡态结构相关的振动方式。
  * 总结下：如果你不跑分子动力学，不用`dimer`方法算过渡态， 那么多出来的这些行都会是0，是可有可无的，对计算无任何影响。看着不爽，直接删掉即可。

### `CONTCAR` 的作用

这里新手暂时不要求，大师兄可能会将其移到其他的章节，只需要记住本书里面有`CONTCAR`的用法，以后再找下即可。通过上面的学习，我们知道，`CONTCAR`和`POSCAR`一样，就是用来保存优化结构的。可能有些地方与我们自己手动写的`POSCAR`有些不同（比如每行开始的空格），但只要你不用tab，这都是无关痛痒的事情。下面我们介绍一下`CONTCAR`的2个用法。

1） 计算完成之后，`CONTCAR`中是最后一步优化的结果。我们可以通过一些可视化的软件打开`CONTCAR`，检查计算的对不对。这个也是大家以后做计算最基本的工作。

2） 如果你的计算半路由于各种各样的原因给停掉了，服务器不稳定，断电，自己手欠误删任务或者将计算的文件夹位置移动了，都会导致计算失败。这个时候，我们就需要**续算**，`CONTCAR`的作用就展示出来了。续算又分为三种情况：

A）第一个离子步没有算完，任务就挂掉了。这种情况，`CONTCAR`是不会更新的，我们再次用原来的输入文件提交一次就行了。

B）我们的计算已经完成了大于或者等于1的离子步，但小于INCAR中设置的NSW的数值。这个时候CONTCAR的内容已经是离任务死掉最近的结构了。我们只需要将其复制成POSCAR，然后再次提交任务即可。具体操作如下：

```bash
mv POSCAR POSCAR_0
mv OUTCAR OUTCAR_0
cp CONTCAR POSCAR 
```

师兄，你不是说只把CONTCAR复制成POSCAR就可以了吗？ 为什么前面还多了一个`mv`的命令?

在这里，大师兄要教给你做计算一个超级重要的原则：**时时刻刻都要努力提高或者保证计算可重复性。**

因为我们的任务是从之前的`POSCAR`（标记为A）开始的，中途断掉了，直接把`CONTCAR`（标记为C_A）复制成`POSCAR`（标记为B）的话，我们就会损失掉前面优化的过程。相当于我们直接搭建了这个B这个结构进行优化计算。而实际上，我们后面的计算的性质是续算，而不是从头直接计算。虽然结果大部分情况都是一样的。所以在将`CONTCAR`复制成`POSCAR`计算之前，我们要尽可能把任务停掉前的计算过程保存记录下来。这就类似于写实验记录本，我们要从开始搭建设备到开展反应一系列的详细信息都记录在上面。而不能从半路直接跳着写。这也是很多人在做计算的时候，任务死掉后续算所忽略的一个很严肃的问题。

下面是大师兄本人在续算的时候所用到的一个保存前面计算的小脚本：

```shell
#!/usr/bin/env bash

mv POSCAR POSCAR-$1
mv OUTCAR OUTCAR-$1
mv OSZICAR OSZICAR-$1
mv vasprun.xml vasprun.xml-$1
mv CONTCAR POSCAR
```

通过这个脚本，我们扩展到第三种情况。

C）我们的计算达到的`INCAR`中所设置的`NSW`的数值。比如设置的`NSW = 1000`，实际上跑了`1000`步，任务停下来了，也就是所谓的结构优化没有收敛。这种情况我们需要做的又有2个步骤：

I）首先，要检查`CONTCAR`中的结构是不是正确的，如果结构跑乱了，体系中原子乱飞，有很大可能会导致不收敛的情况。如果是结构乱了，我们就要找原因去解决。主要还是在以下三个方向下功夫：

* 初始结构是否合理
* `POSCAR`中的元素顺序与`POTCAR`中的是不是一致
* 是不是用的`gamma`点，然后把体系放开了。

II）如果前面检查的结构没问题，这种情况，可能是因为你设置的NSW值太小导致的，或者体系是在是太难收敛，比如过渡态优化的情况。那么我们就需要继续算了。此时，为了保证计算的可重复性，我们必须要将上一步的计算保存记录下来。比如下面，大师兄本人的一个过渡态的优化：

```
qli@tekla2:~/test$ ls
CONTCAR    DOSCAR    EIGENVAL  INCAR    OSZICAR    OSZICAR-2  OUTCAR    OUTCAR-2  PCDAT   POSCAR-1  POSCAR-3  REPORT  sub16  vasprun.xml
CONTCAR-1  DOSCAR-1  IBZKPT    KPOINTS  OSZICAR-1  OSZICAR-3  OUTCAR-1  OUTCAR-3  POSCAR  POSCAR-2  POTCAR    sub12   sub28
qli@tekla2:~/test$ grep NSW INCAR
NSW = 800
qli@tekla2:~/test$ tail OSZICAR -n 3 
RMM:   8    -0.339073663363E+03    0.17227E-04   -0.45367E-05  3703   0.126E-02    0.104E-02
RMM:   9    -0.339073663179E+03    0.18447E-06   -0.78164E-06  2696   0.541E-03
 800 F= -.34272018E+03 E0= -.34270858E+03  d E =0.159932E-02
qli@tekla2:~/test$ ls
CONTCAR    DOSCAR    EIGENVAL  INCAR    OSZICAR    OSZICAR-2  OUTCAR    OUTCAR-2  PCDAT   POSCAR-1  POSCAR-3  REPORT  sub16  vasprun.xml
CONTCAR-1  DOSCAR-1  IBZKPT    KPOINTS  OSZICAR-1  OSZICAR-3  OUTCAR-1  OUTCAR-3  POSCAR  POSCAR-2  POTCAR    sub12   sub28
qli@tekla2:~/test$ save_calculations.sh 4
qli@tekla2:~/$ ls
CONTCAR-1  DOSCAR-1  IBZKPT  KPOINTS    OSZICAR-2  OSZICAR-4  OUTCAR-2  OUTCAR-4  POSCAR    POSCAR-2  POSCAR-4  REPORT  sub16  vasprun.xml-4
DOSCAR     EIGENVAL  INCAR   OSZICAR-1  OSZICAR-3  OUTCAR-1   OUTCAR-3  PCDAT     POSCAR-1  POSCAR-3  POTCAR    sub12   sub28
qli@tekla2:~/test$ vi INCAR
qli@tekla2:~/ru_chbr/ads/high_coverage_br/1Br/ch3br/ts_c-br/test$ qsub sub12
Your job 215093 ("freq-4B2") has been submitted

```

**详解：**

* 前面的脚本名字为： `save_calculations.sh`
* 在使用这个脚本前，大师兄已经算过3次了，每次都跑到了800步，没有收敛，而第四次依然没有收敛，就需要用脚本将当前第四次的计算记录下来下来；
* 脚本使用方法：`save_calculation.sh  N`  N为第几次算，这里用了4，然后就会得到相应的`POSCAR-4`， `OSZICAR-4`， `OUTCAR-4`等文件，记录第四次计算的细节；
* 保存之后，我们就可以提交任务继续苦苦等待了。



### 总结

到这里，CONTCAR的基本介绍以及作用差不多就讲完了。新手们看到后可能会很困惑，因为里面很多内容是大师兄临时加进去给有经验的人写的。只要记住一句话就完成本节的学习任务：CONTCAR的作用跟POSCAR一样，存储的是模型被优化过的结构信息。