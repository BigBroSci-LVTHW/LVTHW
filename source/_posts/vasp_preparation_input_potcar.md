---
title: Ex1 VASP基本输入文件的准备（POTCAR）
---



这一节，我们学习VASP计算中的赝势文件：***POTCAR***

### 简单说明

如果组里安装了VASP，则在某个目录下，一定会有对应的一套对应的赝势文件，本书默认大家已经知道去哪里找，不讨论从哪里下载POTCAR（小窍门：一般各个VASP相关的QQ群中，都会有打包的POTCAR文件）。在该目录下， 一般来说，会有LDA，PBE，和PW91这三个文件夹，主流的计算一般都是用PBE。当你进入PBE的文件夹后，就会找到各个元素所对应的POTCAR文件了。



**POTCAR中各项的含义**

POTCAR中有很多信息，对于大部分的参数，本人也是只认识字母，不知具体含义，所以只能介绍一下在实际计算中会用到的一些参数。我们用Fe的POTCAR中前面的几行作为一个例子，简单介绍一下。

```
 PAW_PBE Fe 06Sep2000
 8.00000000000000000
 parameters from PSCTR are:
   VRHFIN =Fe:  d7 s1
   LEXCH  = PE
   EATOM  =   594.4687 eV,   43.6922 Ry

   TITEL  = PAW_PBE Fe 06Sep2000
   LULTRA =        F    use ultrasoft PP ?
   IUNSCR =        1    unscreen: 0-lin 1-nonlin 2-no
   RPACOR =    2.000    partial core radius
   POMASS =   55.847; ZVAL   =    8.000    mass and valenz
   RCORE  =    2.300    outmost cutoff radius
   RWIGS  =    2.460; RWIGS  =    1.302    wigner-seitz radius (au A)
   ENMAX  =  267.883; ENMIN  =  200.912 eV
   RCLOC  =    1.701    cutoff for local pot
   LCOR   =        T    correct aug charges
   LPAW   =        T    paw PP
   EAUG   =  511.368
   DEXC   =    -.022
   RMAX   =    2.817    core radius for proj-oper
   RAUG   =    1.300    factor for augmentation sphere
   RDEP   =    2.442    radius for radial grids
   QCUT   =   -4.437; QGAM   =    8.874    optimization parameters
```

依个人的学习经验，VRHFIN， LEXCH，TITEL，ZVAL，ENMAX是用到最多的几个参数。

* VRHFIN 用来看元素的价电子排布，如果你元素周期表倒背如流，可以忽略这个参数；
* LEXCH 表示这个POTCAR对应的是GGA-PBE泛函；如果INCAR中不设定泛函，则默认通过这个参数来设定。
* TITEL 就不用说了，指的是哪个元素，以及POTCAR发布的时间；
* ZVAL 指的是实际上POTCAR中价电子的数目，尤其是做Bader电荷分析的时候，极其重要。
* ENMAX 代表默认的截断能。与INCAR中的ENCUT这个参数相关。

当然，如果你进入文件夹，使用ls命令后，会发现：即使对于同一个元素来说，也可能会有很多不同的情况。比如：

* 与GW 计算的对应的POTCAR，则标注为：Fe_GW 这样。（GW计算本人没接触过，这里就没有办法继续下去了）；
* 根据价电子的处理方式，分成了诸如：Fe，Fe_pv，Fe_sv的这样的情况。v是valence的缩写。pv代表把内层的p电子作为价电子来处理。sv代表则是把更内层的s电子也作为价电子来处理。具体到自己体系中的元素，可以结合元素周期表，以及ZVAL关键词所对应的价电子数目，来进行推断。
* 此时，我们就需要学习一个非常有用的Linux命令了： grep。 下面是我们使用grep命令，来获取所有与Fe相关POTCAR的价电子信息。

```
$ ls Fe*
Fe:
POTCAR  PSCTR

Fe_GW:
POTCAR  PSCTR

Fe_pv:
POTCAR  PSCTR

Fe_sv:
POTCAR  PSCTR

Fe_sv_GW:
POTCAR  PSCTR

$ grep ZVAL Fe*/POTCAR
Fe/POTCAR:   POMASS =   55.847; ZVAL   =    8.000    mass and valenz
Fe_GW/POTCAR:   POMASS =   55.847; ZVAL   =    8.000    mass and valenz
Fe_pv/POTCAR:   POMASS =   55.847; ZVAL   =   14.000    mass and valenz
Fe_sv/POTCAR:   POMASS =   55.847; ZVAL   =   16.000    mass and valenz
Fe_sv_GW/POTCAR:   POMASS =   55.847; ZVAL   =   16.000    mass and valenz
```

* 还有把内层d轨道考虑到价电子层里面去的，比如：Ge_d。
* 某些元素，还有一些以 _h， _s 结尾的，应该是 hard和soft的缩写。带h的POTCAR中截断能比普通的要高出很多。带s的截断能要小很多。这里我们就可以通过grep 结合 ENMAX来查看一下：

```
$ grep ENMAX Ge*/POTCAR
Ge/POTCAR:   ENMAX  =  173.807; ENMIN  =  130.355 eV
Ge_d/POTCAR:   ENMAX  =  310.294; ENMIN  =  232.720 eV
Ge_d_GW/POTCAR:   ENMAX  =  375.434; ENMIN  =  281.576 eV
Ge_GW/POTCAR:   ENMAX  =  173.807; ENMIN  =  130.355 eV
Ge_h/POTCAR:   ENMAX  =  410.425; ENMIN  =  307.818 eV
Ge_sv_GW/POTCAR:   ENMAX  =  410.425; ENMIN  =  307.818 eV
```



**POTCAR的选择**

既然对于同一个元素，存在那么多的POTCAR类型，计算的时候我们改怎么选择呢？这里大师兄只能给的建议是：如果没有特别的需求，直接采用VASP官网推荐的即可。参考链接：

https://cms.mpi.univie.ac.at/vasp/vasp/Recommended_PAW_potentials_DFT_calculations_using_vasp_5_2.html

我们在计算的时候，根据体系中的元素，将这些元素的POTCAR结合起来，组成一个新的POTCAR，这个结合的步骤，我们需要用到Linux的另一个命令：cat。比如VASP官网的例子，体系中含有Al， C，H三种元素。

```
cat ~/pot/Al/POTCAR ~/pot/C/POTCAR ~/pot/H/POTCAR >POTCAR
```

通过这一行命令就可以把Al，C，H各自的POTCAR结合在一起。OTCAR中的元素顺序一定要和POSCAR保持一致,否则计算会出错，为了避免计算出错，还有一些高级的方法，这个在后面会慢慢讲解。

本节讲的是O原子的计算，官网推荐的氧原子POTCAR，默认的截断能是400，价层有6个原子。直接把O这个文件夹中的POTCAR直接复制到INCAR所在的目录即可。



**POTCAR检查常用的Linux命令：**

查看POTCAR中的元素:  

```
grep  TIT POTCAR
```

查看POTCAR的截断能: 

```
grep  ENMAX POTCAR
```

查看POTCAR中元素的价电子数目：

```
grep  ZVAL POTCAR
```

举一反三，只要找到了关键词，我们就可以通过grep命令来进行查看。



### 总结：

这一节，我们简单介绍了一下POTCAR中的内容，选取规则，以及通过grep命令和关键词进行查看。如果你能独立完成下面的几点，就圆满完成了本节的学习：

* VRHFIN， LEXCH，TITEL，ZVAL，ENMAX 这几个参数的大体意思；
* 初步了解：Fe_sv，Fe_pv， Ge_d,  Ge_gw，C_s, C_h 这些标记的含义；
* 查看VASP官网，了解VASP推荐的POTCAR；
* 使用grep来获取POTCAR中有价值的信息。