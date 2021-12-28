---
title: Ex06 VASP的输出文件（一）
categories: 
- LVASPTHW
tags: 
- CONTCAR
- 续算
date: 2017-10-27 15:30:16
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



上一节，我们学习了`CONTCAR`的一些基本内容。本着从简到易，从最常用到最不常用的原则，这一节，我们学习VASP的另外一个简单，但又很重要的的输出文件：`OSZICAR`。 

首先，推荐一个QE学习的视频：https://www.bilibili.com/video/av36194036 （用良心带人入坑）

### `OSZICAR` 的含义

师兄，`OSZICAR`是什么的缩写？为什么起这么一个名字？

不好意思，这个我真不知道。也没有认真去考证过。目前只能告诉大家先把这个名字记住。

### 什么是优化？

在介绍`OSZICAR`的内容和功能之前，有必要先给大家澄清一个计算中常见的词：优化。

计算一个体系，我们有`2`个优化过程：

* 电子结构的优化： 可以理解为对某一固定的几何结构，迭代求解薛定谔方程来获得体系能量极小值的一个过程。这个迭代过程，每一次迭代求解都可以认为是电子结构的一个优化。（通常被大伙称为：电子步）
* 几何结构的优化：可以理解为在电子结构优化的结果上，获取原子的受力情况，然后根据受力情况，调节原子的位置，再进行电子结构优化，获取新的受力情况，然后再调节原子位置，一直重复这样的过程，直至找到体系势能面上一个极小值的过程。（通常被大伙称为：离子步）

思考一下，我们的`O`原子，我们只可能对它进行电子结构的优化，因为它的几何结构不会发生变化。

### `OSZICAR`是干什么的？

当VASP迭代求解`O`原子电子结构的时候，整个过程就会记录在OSZICAR中。下面我们就看一下VASP官网对`OSZICAR`的解释说明：https://cms.mpi.univie.ac.at/wiki/index.php/OSZICAR

```fortran
Information about convergence speed and about the current step is written to stdout and to the **OSZICAR** file. Always keep a copy of the **OSZICAR** file, it might give important information.
```

也就是说：`OSZICAR`是用来记录优化过程一些信息的文件。这里的优化过程既包括电子结构，又包括几何结构。

### `OSZICAR`长什么样子？

在Linux的终端中，使用Vim打开`OSZICAR`，你会得到类似下面的信息：

```fortran
       N       E                     dE             d eps       ncg     rms          rms（c）
DAV:   1     0.324969965196E+02    0.32497E+02   -0.10270E+03    48   0.977E+01
DAV:   2     0.501749892771E+00   -0.31995E+02   -0.31995E+02    72   0.202E+01
DAV:   3    -0.182605770767E-01   -0.52001E+00   -0.50521E+00    48   0.521E+00
DAV:   4    -0.203547758465E-01   -0.20942E-02   -0.20860E-02    96   0.333E-01
DAV:   5    -0.203547873947E-01   -0.11548E-07   -0.11210E-07    48   0.844E-04    0.307E-01
DAV:   6    -0.213726161828E-01   -0.10178E-02   -0.17884E-03    48   0.111E-01    0.155E-01
DAV:   7    -0.214708381542E-01   -0.98222E-04   -0.23522E-04    48   0.459E-02
   1 F= -.21470838E-01 E0= -.13757722E-01  d E =-.154262E-01
```

* 第一行中各项的含义：（没汉语解释的，大师兄也翻译不出来）

  1） `N` 代表电子结构的迭代步数，通常被大家称为电子步。

  2） `E` 代表当前电子步的体系能量;

  3） `dE`当前电子步和上一步体系能量的差值;

  4） `d eps` the change in the band structure energy; 

  5）`ncg` the number of evaluations of the Hamiltonian acting onto a wavefunction; 

  6） `rms`  the norm of the residuum of the trialwavefunctions （i.e. their approximate error）

  7） `rms (c)` the difference between input and output charge density.

* 第二行中`DAV`的含义：

  1） `Blocked Davidson algorithm`的缩写。看不懂不要紧，简单点：就是一个电子迭代求解的自洽算法。在对电子结构迭代求解的过程，前人们发展出了很多不同的算法。就好比是，从北京到南京，有很多种出行选择一样，可以坐火车，汽车，乘飞机，也可以步行，骑马，骑驴，骑自行车，等等。每一种出行方式都是一种算法。大家可以根据自己的情况，选择适合自己的出行方式。所以，对自己的研究方向，也需要找一个适合自己体系的合适的算法。

  2） 除了`DAV`，今后你还会看到`RMM` （residual minimization scheme） 和 `CG` （conjugate-gradient algorithm）等等。选择不同的算法，第二行以及后面显示的也会有所区别。这点大家掌握即可。具体到每个算法怎么回事，当你计算算起来了，有余力，慢慢开始学习量化基础知识的时候再仔细琢磨。

  3） 前面我们说了，要找一个适合自己体系的算法，是选`DAV`，`RMM`还是`CG`，亦或是其他的呢？ 这个可以在`INCAR`中通过参数`ALGO`设置，参考链接： https://cms.mpi.univie.ac.at/wiki/index.php/ALGO 。一般来说，使用`ALGO = Fast`可以满足大部分的需求。可以理解为北京到南京出行，大家最常用的火车。

  4） 师兄：这个氧原子的计算中，我们没有在`INCAR`中设置`DAV`这个算法相关的参数啊，为什么`OSZICAR`中还会出现`DAV`呢？

  原因在于：同很多软件一样，`VASP`也有很多`默认的参数`，这就避免了当你不设置某个参数的时候进行不下去的尴尬局面，当然，有些相关的参数，你不设置的时候VASP也会罢工，这个我们以后再说。此时的计算，对于电子结构收敛的算法来说，默认的是`DAV`这个方法，也就是INCAR中： `ALGO = N`。

  5）划重点：

  我们知道`VASP`的`INCAR`设置中，有很多相应的参数。而新手恰恰在学习的过程中，由于不能在短时间了解这些参数的具体含义，使用方法，从而导致了不知道怎么去选择的情况。而就是在这种情况下，选择了胡搞。也就是`INCAR`中参数，认识的写上去，不认识的也写上去。这也恰恰是新手在计算过程中容易出错的一个主要原因。前面我们说了`VASP`有很多默认的参数，而新手在学习的时候，不能图快，要一步一个脚印地走。看见一个参数，就好好琢磨琢磨，争取理解透了，或者知道这个参数大体上怎么回事。如果你不认识的参数，千万不要写上去，使用默认的就可以。

* 最后一行：

  1） `F`前面的 1 代表几何结构优化的次数（也称为离子步的步数），本练习只有1步。

  2） `F =` 是体系的总能量, 与`OUTCAR`中 `free energy  TOTEN` 后面的值相等；（`OUTCAR`还没讲，暂且记住）

  3） `E0` 后面的能量对应`OUTCAR`中 `energy (sigma->0)`后面的能量（下图到数第一行）。



### `OSZICAR` 的作用

Always keep a copy of the **OSZICAR** file, it might give important information. 官网既然这么说，这表明OSZICAR确实很重要，重要在哪里呢？ 

* 整个体系的优化过程都记录下来了。（当然后面我们要讲的`OUTCAR`也以更加详细的方式将优化过程记下来了）但`OSZICAR`可以更加直观地观测我们体系优化过程中能量的变化过程。

* 通过`OSZICAR`获取体系的能量，也就是`E0`后面的那一项。**很多人在使用`VASP`的时候，不知道该选择哪个能量**，这里大师兄就告诉你：选择`E0`后面的即可。不管你有什么疑问，不管别人怎么跟你争论，都不要管，先老老实实记住：我们选`E0`后面的这个能量。随着你的学习，很多疑问自己就解开了。命令使用方式：

  ```
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex05$ grep E0 OSZICAR  
     1 F= -.21470838E-01 E0= -.13757722E-01  d E =-.154262E-01
  ```

* 后面的学习中，我们会经常讲解`OSZICAR`相关的内容，由于时间的原因，也主要是因为新手才刚刚接触计算，就不做过多的解释。



### 总结

这一节，我们需要了解和学习的内容主要有以下几个方面：

1） `VASP`计算中的优化：几何和电子结构优化大体有个了解

2）`OSZICAR`中各项的含义，争取多理解几个；

3）`DAV`对应的`INCAR`中`ALGO`是怎么设置的；一般来说`ALGO=FAST`可以满足大部分人的计算需求；

4）知道`VASP`有默认的参数，自己不要画蛇填足。保持`INCAR`干净整洁，不知道的，模糊不清的参数坚决不往`INCAR`里面写。

5）知道怎么从`OSZICAR`中获取体系的能量。

