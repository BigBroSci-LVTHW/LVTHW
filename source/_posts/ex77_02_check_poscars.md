---
title: Ex76 NEB计算前结构的检查（二）
categories: 
- LVASPTHW
tags: 
- NEB
- 过渡态
- 检查
date: 2018-11-17 15:30:16
---



前面一节，我们提到说，在`Ubuntu`或者其他`Linux`系统下面，可以使用`p4vasp`或者`ASE`将结构批量打开，查看我们初步设置的NEB路径是否合理。但是在`Windows`系统下，我们不方便使用命令进行查看。这里介绍一下在`Windows`下面通过`VASPkit`结合`VMD`查看NEB路径结构的方法。



### 软件的获取：

* `VASPkit`程序的下载
  * 链接：https://sourceforge.net/projects/vaspkit/
  * QQ群：217821116， 364586948
* `VMD`的下载链接：http://www.ks.uiuc.edu/Research/vmd/ 



### `vaspkit`的使用

```fortran
iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ ls
00  01  02  03  04  05  06  07  08  09  INCAR  KPOINTS  NEB.pdb  POTCAR
iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ rm NEB.pdb 
iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ ls
00  01  02  03  04  05  06  07  08  09  INCAR  KPOINTS  POTCAR
iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ vaspkit 
 
 +---------------------------------------------------------------+
 |             VASPKIT Version: 0.71 (16 Nov. 2018)              |
 |       A Pre- and Post-Processing Program for VASP Code        |
 |       Official Website: http://vaspkit.sourceforge.net        |

*
*
*
*                                                                 
 0)  Quit                                                         
 ------------>>
5
 ==================== Catalysis-ElectroChem Kit ==================
 501) Thermal Corrections for Adsorbate                      
 502) Thermal Corrections for Gas                    
 503) d-Band Center (experimental)                    
 504) Convert NEB-Path to PDB Format for Animation                    
                                                                  
 0)   Quit                                                        
 9)   Back                                                        
 ------------>>
504
 +-------------------------- Warm Tips --------------------------+
         See An Example in vaspkit/examples/neb_animation.        
 +---------------------------------------------------------------+
 -->> (1) Reading Structural Parameters from 00/POSCAR File...
 +---------------------------------------------------------------+
*
*
*
+---------------------------------------------------------------+
 |               Selective Dynamics is Activated!                |
 +---------------------------------------------------------------+
 -->> (*) Reading Structural Parameters from 09/POSCAR File...
 +---------------------------------------------------------------+
 |               Selective Dynamics is Activated!                |
 +---------------------------------------------------------------+
 +---------------------------------------------------------------+
 |                         * DISCLAIMER *                        |
 |        CHECK Your Results for Consistency if Necessary        |
 |   Bug Reports and Suggestions for Improvements Are Welcome    |
 | Citation of VASPKIT Is Not Mandatory BUT Would Be Appreciated |
 |                     (^.^) GOOD LUCK (^.^)                     |
 +---------------------------------------------------------------+
 iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ 
iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ ls
00  01  02  03  04  05  06  07  08  09  INCAR  KPOINTS  NEB.pdb  POTCAR
iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ 
iciq-lq@ln3:/THFS/home/iciq-lq/demo_neb$ 

```



* 在终端输入:` vaspkit`
* 输入：5 后回车
* 输入：504 后回车
* 然后你会得到一个`NEB.pdb`文件。
* `pdb`文件包含了00到09这几个文件夹中`POSCAR`的结构信息，用以`VMD`进行 查看。



### `VMD` 查看`pdb`文件

使用`VMD`查看`pdb`的方法，我们将`VASPkit`中的具体说明拿过来展示一下：

* 在`Windows`系统中启动`VMD`程序
* 将我们在服务器中生成的`NEB.pdb`文件下载到本地，然后拖到`VMD`的界面
* 在`VMD`主窗口选择菜单 `Display` --> `Orthographic` 正交显示模式 
* 在`VMD`主窗口选择菜单`Graphics` --> `Representations` --> `Drawing Methods` 选择 `CPK`
* 默认是不显示盒子边界的，在`VMD`主窗口选择菜单 `Extensions` ,选择 `Tk Console` , 在弹出的`VMD TkConsole` 窗口中输入 `pbc box -color white` ，然后回车，查看模型结构。
* 点界面的右下角的箭头后，你可以看到我们初步猜测的`NEB`路径中原子快速动起来了。箭头左面有个`speed`，我们可以调节原子的速度。
* 在`VMD`主窗口选择菜单 `Mouse` --> `Label` --> `2`， 然后去模型界面上，点与`NEB`路径中最相关的2个原子，就可以查看`NEB`路径中，原子间距离随着`IMAGE`结构的变化了。



### 总结

Windows下的用户，在做过渡态计算的时候，可视化是一个痛点，通常来说，Images中的结构都只能一个一个打开查看，计算的时候不能很好地体会一个反应的发生路径。使用VASPkit则可以顺利地解决这个问题，这个功能更详细的说明，请参考VASPkit的使用手册。此外，大师兄还是建议大家有余力的时候多多接触类似于Ubuntu，Centos这样的Linux操作系统。