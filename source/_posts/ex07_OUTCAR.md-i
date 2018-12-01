---
title: Ex07 VASP的输出文件（三）
categories: 
- LVASPTHW
tags: 
- OUTCAR
date: 2018-10-29 18:30:16
---



`CONTCAR`、`OSZICAR`我们已经大体了解了一下，这一节我们我们学习VASP的另一个极其重要的输出文件：`OUTCAR`。前面我们介绍到`OSZICAR`中包含了体系结构优化，电子结构迭代收敛的简单信息。`OUTCAR`中也包含这些信息，而且比`OSZICAR`的内容更加详细。此外，计算的参数设置（`INCAR`中有的，以及默认的），K点的设置，赝势的基本信息，`VASP`的版本，体系的几何结构以及电子性质相关的内容，计算的时间等，也都包含在`OUTCAR`中。所以说，`OUTCAR`是关于我们当前计算的一个非常全面的，多方位的信息汇总。

信息太多，VASP官网也没有对`OUTCAR`一个很详细地描述，大部分都是穿插在INCAR的计算参数中介绍的。这是因为（本人自己瞎猜的）：

* `VASP`可以计算的性质很多，每一个特定的任务都有其对应的输出内容，这就导致了`OUTCAR`的复杂多样性，比如说优化结构、频率、声子谱，能带、`DOS`等计算等，这些都会有特定的输出，需要用户根据自己的计算内容去学习；
* 另外一个原因就是里面的条目太多了，每一项单独解释都需要花费大量的时间。

信息多，就会容易让人眼花缭乱，不知所措。本节，我们就理一理思路，揭开`OUTCAR`神秘的面纱，让大家心里不至于那么恐慌。之前我们说过，`VASP`有很多输出文件，日常用的也就那么几个，有些估计等你文章发表了都不一定能用上。这也同样适用于`OUTCAR`中的信息，虽然多，但大部分基本用不到。



首先要告诉大家的是，`VASP`各个输出部分之间用很长的横杠分割（---------------------），当你看到横杠的时候，就知道要进入结果的下一个部分内容了。举个`OUTCAR开头`的例子。

```
 vasp.5.4.4.18Apr17-6-g9f103f2a35 (build Sep 22 2017 10:53:27) complex

 executed on             LinuxIFC date 2018.11.12  03:58:57
 running on   24 total cores
 distrk:  each k-point on   24 cores，    1 groups
 distr:  one band on NCORES_PER_BAND=   1 cores，   24 groups


--------------------------------------------------------------------------------------------------------
```

`VASP`的版本信息，在多少个核上运行。所以，如果你不知道，自己的任务是VASP哪个版本计算的，也不知道如何去`VASP`的安装目录查找版本信息，可以运行一下，然后在`OUTCAR`的开头去找。可以看到，后跟着一堆`-`，说明要进入下一部分内容（计算体系，参数）的描述了。分别是：`POTCAR`，`POSCAR`，`KPOINTS`，以及`INCAR`的信息。

```
 -----------------------------------------------------------------------------
|                                                                             |
|           W    W    AA    RRRRR   N    N  II  N    N   GGGG   !!!           |
|           W    W   A  A   R    R  NN   N  II  NN   N  G    G  !!!           |
|           W    W  A    A  R    R  N N  N  II  N N  N  G       !!!           |
|           W WW W  AAAAAA  RRRRR   N  N N  II  N  N N  G  GGG   !            |
|           WW  WW  A    A  R   R   N   NN  II  N   NN  G    G                |
|           W    W  A    A  R    R  N    N  II  N    N   GGGG   !!!           |
|                                                                             |
|      For optimal performance we recommend to set                            |
|        NCORE= 4 - approx SQRT( number of cores)                             |
|      NCORE specifies how many cores store one orbital (NPAR=cpu/NCORE).     |
|      This setting can  greatly improve the performance of VASP for DFT.     |
|      The default，   NCORE=1            might be grossly inefficient         |
|      on modern multi-core architectures or massively parallel machines.     |
|      Do your own testing !!!!                                               |
|      Unfortunately you need to use the default for GW and RPA calculations. |
|      (for HF NCORE is supported but not extensively tested yet)             |
|                                                                             |
 -----------------------------------------------------------------------------

 POTCAR:    PAW_PBE O 08Apr2002
   VRHFIN =O: s2p4
   LEXCH  = PE
   EATOM  =   432.3788 eV，   31.7789 Ry

   TITEL  = PAW_PBE O 08Apr2002
   LULTRA =        F    use ultrasoft PP ?
   IUNSCR =        1    unscreen: 0-lin 1-nonlin 2-no
   RPACOR =    1.200    partial core radius
   POMASS =   16.000; ZVAL   =    6.000    mass and valenz
   RCORE  =    1.520    outmost cutoff radius
   RWIGS  =    1.550; RWIGS  =    0.820    wigner-seitz radius (au A)
   ENMAX  =  400.000; ENMIN  =  300.000 eV
   ICORE  =        2    local potential
   LCOR   =        T    correct aug charges
   LPAW   =        T    paw PP
   EAUG   =  605.392
   DEXC   =    0.000
   RMAX   =    1.553    core radius for proj-oper
   RAUG   =    1.300    factor for augmentation sphere
   RDEP   =    1.550    radius for radial grids
   RDEPT  =    1.329    core radius for aug-charge

```

基本上每次运行的时候，（即使你的输入是正确的），`VASP`都会输出一个大大的`WARNING`来吓唬你，不用担心，无视即可。但如果你的计算失败了，这个警告信息**或许**（个人感觉基本没用）对你排查错误可能会有所帮助。 `WARNING`下面是`POTCAR`的基本信息，如果你想通过`OUTCAR`查看`POTCAR中`的元素时，可以使用下面的命令：

```
grep POTCAR OUTCAR
grep TIT OUTCAR
grep ENMAX OUTCAR
grep ZVAL OUTCAR # 
```

`ZVAL`是该`POTCAR`中对应元素的价电子，这里氧原子含有6个外层价电子。你可以自行对比下`POTCAR`中的内容。再往下，就是`POSCAR`的内容：坐标格式，原子位置，以及晶胞的形状大小。

```
--------------------------------------------------------------------------------------------------------


 ion  position               nearest neighbor table
   1  0.000  0.000  0.000-

  LATTYP: Found a simple cubic cell.
 ALAT       =     8.0000000000

  Lattice vectors:

 A1 = (   8.0000000000，   0.0000000000，   0.0000000000)
 A2 = (   0.0000000000，   8.0000000000，   0.0000000000)
 A3 = (   0.0000000000，   0.0000000000，   8.0000000000)


Analysis of symmetry for initial positions (statically):
=====================================================================
 Subroutine PRICEL returns:
 Original cell was already a primitive cell.


 Routine SETGRP: Setting up the symmetry group for a
 simple cubic supercell.


 Subroutine GETGRP returns: Found 48 space group operations
 (whereof 48 operations were pure point group operations)
 out of a pool of 48 trial point group operations.


The static configuration has the point symmetry O_h .


Analysis of symmetry for dynamics (positions and initial velocities):

```

体系的对称性以及点群操作相关的信息，在这里我们的体系是立方体，为`O_h`的点群，有48个对称操作。群论的知识大师兄早已原封不动地还给老师了，在这里就不再详细介绍了…

K点信息：想查看K点个数：`grep irreducible OUTCAR`  或者 `grep irre OUTCAR`

```
 Subroutine IBZKPT returns following result:
 ===========================================

 Found      1 irreducible k-points:

 Following reciprocal coordinates:
            Coordinates               Weight
  0.000000  0.000000  0.000000      1.000000

 Following cartesian coordinates:
            Coordinates               Weight
  0.000000  0.000000  0.000000      1.000000



--------------------------------------------------------------------------------------------------------
```



**下一部分就是`INCAR`的参数：**

```
 SYSTEM =  O atom
 POSCAR =  O atom in a box

 Startparameter for this run:
   NWRITE =      2    write-flag & timer
   PREC   = normal    normal or accurate (medium， high low for compatibility)
   ISTART =      0    job   : 0-new  1-cont  2-samecut
   ICHARG =      2    charge: 1-file 2-atom 10-const
   ISPIN  =      1    spin polarized calculation?
   LNONCOLLINEAR =      F non collinear calculations
   LSORBIT =      F    spin-orbit coupling
   INIWAV =      1    electr: 0-lowe 1-rand  2-diag
   LASPH  =      F    aspherical Exc in radial PAW
   METAGGA=      F    non-selfconsistent MetaGGA calc.

 Electronic Relaxation 1
   ENCUT  =  400.0 eV  29.40 Ry    5.42 a.u.  13.05 13.05 13.05*2*pi/ulx，y，z
   ENINI  =  400.0     initial cutoff
   ENAUG  =  605.4 eV  augmentation charge cutoff
   NELM   =     60;   NELMIN=  2; NELMDL= -5     # of ELM steps
   EDIFF  = 0.1E-03   stopping-criterion for ELM
   LREAL  =      F    real-space projection
   NLSPLINE    = F    spline interpolate recip. space projectors
   LCOMPAT=      F    compatible to vasp.4.4
   GGA_COMPAT  = T    GGA compatible to vasp.4.4-vasp.4.6
   LMAXPAW     = -100 max onsite density
   LMAXMIX     =    2 max onsite mixed and CHGCAR
   VOSKOWN=      0    Vosko Wilk Nusair interpolation
   ROPT   =    0.00000

```

计算参数详情（默认的参数值以及代表的意义也列出来了，这个地方大家仔细看下， 一些不常见的参数，`VASP`会自动采用默认值。上面给我们的启示就是：不懂就不要写，默认就可，很多默认的参数也没必要在`INCAR`里面再额外写一遍！**强调一下**，不知道的参数，不要瞎往`INCAR`里面放！新手的话经常会加一些乱七八糟的参数，导致计算错误。）



在统计完任务的基本输入后，`VASP`会总结一下本计算的文字描述，任务类型，体系大小，K点数目，计算所需的内存等信息。然后开始进入正式的计算部分：

```
--------------------------------------------------------------------------------------------------------


 Static calculation
 charge density and potential will be updated during run
 non-spin polarized calculation
 Variant of blocked Davidson
 Davidson routine will perform the subspace rotation
 perform sub-space diagonalisation
    after iterative eigenvector-optimisation
 modified Broyden-mixing scheme， WC =      100.0
 initial mixing is a Kerker type mixing with AMIX =  0.4000 and BMIX =      1.0000
 Hartree-type preconditioning will be used
 using additional bands           21
 reciprocal scheme for non local part
 use partial core corrections
 calculate Harris-corrections to forces
   (improved forces if not selfconsistent)
 use gradient corrections
 use of overlap-Matrix (Vanderbilt PP)
 Gauss-broadening in eV      SIGMA  =   0.01


--------------------------------------------------------------------------------------------------------


  energy-cutoff  :      400.00
  volume of cell :      512.00
      direct lattice vectors                 reciprocal lattice vectors
     8.000000000  0.000000000  0.000000000     0.125000000  0.000000000  0.000000000
     0.000000000  8.000000000  0.000000000     0.000000000  0.125000000  0.000000000
     0.000000000  0.000000000  8.000000000     0.000000000  0.000000000  0.125000000

  length of vectors
     8.000000000  8.000000000  8.000000000     0.125000000  0.125000000  0.125000000



 k-points in units of 2pi/SCALE and weight: K-POINTS
   0.00000000  0.00000000  0.00000000       1.000

 k-points in reciprocal lattice and weights: K-POINTS
   0.00000000  0.00000000  0.00000000       1.000

 position of ions in fractional coordinates (direct lattice)
   0.00000000  0.00000000  0.00000000

.
.
.

 total amount of memory used by VASP MPI-rank0    35846. kBytes
=======================================================================

   base      :      30000. kBytes
   nonl-proj :        746. kBytes
   fftplans  :       1114. kBytes
   grid      :       3834. kBytes
   one-center:          3. kBytes
   wavefun   :        149. kBytes

```



对于O原子的计算来说，就是一个离子步内，电子步的迭代。这里我们只展示一个电子步的迭代信息即可，剩下的格式是一样的。大家在自己查看的时候注意能量在不同迭代步数中的变化。

```
--------------------------------------- Iteration      1(   1)  ---------------------------------------


    POTLOK:  cpu time    0.0240: real time    0.0324
    SETDIJ:  cpu time    0.0030: real time    0.0040
     EDDAV:  cpu time    0.0320: real time    0.0397
       DOS:  cpu time    0.0020: real time    0.0020
    --------------------------------------------
      LOOP:  cpu time    0.0610: real time    0.0781

 eigenvalue-minimisations  :    48
 total energy-change (2. order) : 0.3249700E+02  (-0.1026971E+03)
 number of electron       6.0000000 magnetization
 augmentation part        6.0000000 magnetization

 Free energy of the ion-electron system (eV)
  ---------------------------------------------------
  alpha Z        PSCENC =         0.27139542
  Ewald energy   TEWEN  =       -91.92708002
  -Hartree energ DENC   =      -281.84385743
  -exchange      EXHF   =         0.00000000
  -V(xc)+E(xc)   XCENC  =        26.06853627
  PAW double counting   =       346.54947689     -348.34814756
  entropy T*S    EENTRO =        -0.00000000
  eigenvalues    EBANDS =       -50.53652309
  atomic energy  EATOM  =       432.26319604
  Solvation  Ediel_sol  =         0.00000000
  ---------------------------------------------------
  free energy    TOTEN  =        32.49699652 eV

  energy without entropy =       32.49699652  energy(sigma->0) =       32.49699652


--------------------------------------------------------------------------------------------------------

```

每一电子步完成后，输出结果同时在`OSZICAR`中更新一行。

其中各项的具体含义：

alpha Z and the Ewald energy define the electrostatic  interaction of the ions in a compensating electron gas. The alpha Z component deals with the divergent parts (G=0). The following parts are the Hartree and exchange correlation energy as defined in the Kohn-Sham Hamiltonian. The entropy part stems from the smearing (using the free energy as variational parameter， electronic entropy)， EBANDS from Kohn-Sham eigenvalues， and EATOM is the reference energy for the potential (which is defined in the POTCAR file). 

（摘自：https://cms.mpi.univie.ac.at/vasp-forum/viewtopic.php?t=273）



迭代结束，输出主要的结果：费米能级以及能带信息。

`Band 1` 对应的是2个 2s 电子，

`Band 2-4` 对应的是4个2p电子。固体物理中，费米能级对应的是最高电子占据轨道的能量，也就是`HOMO`，大家可以对比下`band 2-4`的能量和费米能级的能量。

```
--------------------------------------------------------------------------------------------------------




 average (electrostatic) potential at core
  the test charge radii are     0.7215
  (the norm of the test charge is              1.0000)
       1 -83.5438



 E-fermi :  -8.9011     XC(G=0):  -0.8049     alpha+bet : -0.1463


 k-point     1 :       0.0000    0.0000    0.0000
  band No.  band energies     occupation
      1     -23.8440      2.00000
      2      -8.9041      1.33333
      3      -8.9041      1.33333
      4      -8.9041      1.33333
      5      -0.4682      0.00000
      6       1.8628      0.00000
      7       1.8628      0.00000
      8       1.8628      0.00000
      9       1.9954      0.00000
     10       2.0322      0.00000
     11       2.0322      0.00000
     12       4.0245      0.00000
     13       4.0245      0.00000
     14       4.0245      0.00000
     15       4.1983      0.00000
     16       4.1983      0.00000
     17       4.1983      0.00000
     18       4.4039      0.00000
     19       4.4039      0.00000
     20       4.4555      0.00000
     21       4.4555      0.00000
     22       4.4555      0.00000
     23       4.7550      0.00000
     24       6.4902      0.00000


--------------------------------------------------------------------------------------------------------

```

费米能级的获取：`grep E-fermi OUTCAR`

各个方向力的大小，体系的坐标（和`CONTCAR`是一样的），以及体系的能量。下面第一行的意思是达到了我们设置的收敛标准，迭代停止了。（后面我们会详细介绍收敛相关的事项，大家先有个印象。）

```
------------------------ aborting loop because EDIFF is reached ----------------------------------------
.
.
.

  FORCE on cell =-STRESS in cart. coord.  units (eV):
  Direction    XX          YY          ZZ          XY          YZ          ZX
  --------------------------------------------------------------------------------------
  Alpha Z     0.27140     0.27140     0.27140
  Ewald     -30.64236   -30.64236   -30.64236     0.00000     0.00000     0.00000
  Hartree    93.90340    93.90340    93.90340    -0.00000    -0.00000    -0.00000
  E(xc)     -27.94710   -27.94710   -27.94710     0.00000     0.00000     0.00000
  Local    -147.84573  -147.84573  -147.84573     0.00000    -0.00000     0.00000
  n-local   -20.54959   -20.54959   -20.54959    -0.00000    -0.00000    -0.00000
  augment     5.55385     5.55385     5.55385    -0.00000     0.00000    -0.00000
  Kinetic   126.51138   126.51138   126.51138     0.00000     0.00000     0.00000
  Fock        0.00000     0.00000     0.00000     0.00000     0.00000     0.00000
  -------------------------------------------------------------------------------------
  Total      -0.74475    -0.74475    -0.74475     0.00000    -0.00000     0.00000
  in kB      -2.33051    -2.33051    -2.33051     0.00000    -0.00000     0.00000
  external pressure =       -2.33 kB  Pullay stress =        0.00 kB

 VOLUME and BASIS-vectors are now :
 -----------------------------------------------------------------------------
  energy-cutoff  :      400.00
  volume of cell :      512.00
      direct lattice vectors                 reciprocal lattice vectors
     8.000000000  0.000000000  0.000000000     0.125000000  0.000000000  0.000000000
     0.000000000  8.000000000  0.000000000     0.000000000  0.125000000  0.000000000
     0.000000000  0.000000000  8.000000000     0.000000000  0.000000000  0.125000000

  length of vectors
     8.000000000  8.000000000  8.000000000     0.125000000  0.125000000  0.125000000


.
.
.


  FREE ENERGIE OF THE ION-ELECTRON SYSTEM (eV)
  ---------------------------------------------------
  free  energy   TOTEN  =        -0.02147084 eV

  energy  without entropy=       -0.00604461  energy(sigma->0) =       -0.01375772

```

上面的能能量有好几个，很多人不知道该用哪一个。前面我们讲解`OSZICAR`的时候提高了使用E0后面的那个数值。`OUTCAR`中与`E0`对应的是`energy(sigma->0) =` 后面的那个。所以，在今后的学习中，我们不要再提问使用哪个能量的问题了。提取能量的命令：

```
grep  without OUTCAR | tail -n 1
grep '  without' OUTCAR | tail -n 1  # 本人常用的是这个
grep sigma OUTCAR | tail -n 1 
```

之所以用`tail -n 1`是为了保证我们取的是最后一步的能量。O原子肯定就一步，但以后优化结构的时候，就有很多步了。这里有一点需要注意的是：前面出现了一个`entropy`，也就是熵。但这个`Entropy`是采用`ISMEAR`方法而导致的，与物理化学中的熵这个概念不一样，如果你要计算熵，则需要通过计算频率，然后通过公式求解。看不懂不要紧：记住这里的`Entropy`不是物化书中的就OK。



再往下是实际计算的内存和时间等信息，看到下面，说明计算正常结束了。 

```
--------------------------------------------------------------------------------------------------------


 writing wavefunctions
     LOOP+:  cpu time    2.0037: real time    2.1098
    4ORBIT:  cpu time    0.0000: real time    0.0000

 total amount of memory used by VASP MPI-rank0    35846. kBytes
=======================================================================

   base      :      30000. kBytes
   nonl-proj :        746. kBytes
   fftplans  :       1114. kBytes
   grid      :       3834. kBytes
   one-center:          3. kBytes
   wavefun   :        149. kBytes



 General timing and accounting informations for this job:
 ========================================================

                  Total CPU time used (sec):        5.492
                            User time (sec):        1.991
                          System time (sec):        3.501
                         Elapsed time (sec):        5.931

                   Maximum memory used (kb):      104300.
                   Average memory used (kb):           0.

                          Minor page faults:         8571
                          Major page faults:            0
                 Voluntary context switches:         3090
```

分析完前面的内容，大家会发现：具体到里面各项的含义以及各个细节上，还有很多值得讨论的地方，比如群论，薛定谔方程求解过程，`POTCAR`的相关信息等。对于新手来说，看完本节，能大体浏览下来，知道各个部分包含什么内容就很不错了。



### 总结

本练习中，带领大家粗略浏览了一遍`OUTCAR`各部分的信息。大家在浏览的时候时刻要思考：

* 这部分包含的什么内容，具有什么物理或者化学意义？  
* 怎么用`grep 关键词`获取有用的信息等。 
* 怎么获取体系的能量；知道用众多能量中的哪一个。
* 如何将`OUTCAR`的内容与计算的输入和输出文件关联起来。
* 由于计算内容的多样性，对于`OUTCAR`的详细解释，需要很多的时间和精力去完成补充。一次性解释清楚是不可能的事情，所以在后续的计算过程中，我们还会结合具体的例子进行讲解。


 一般来说，等你计算上手之后，`OUTCAR`里面的很多内容，可能等课题结束或者毕业了，都不会用到。更进一步说，你可能都不需要打开`OUTCAR`了。因此，完全不用担心里面的很多内容不理解。但，这不是我们偷懒的理由，如果你想把`VASP`学好，学精，这些都需要自己下功夫去琢磨，理解。