---
title: Ex03 做计算常用的批量处理方法二（sed命令）
---

 

前面练习中我们在0.01的文件夹基础上，通过一个命令，复制得到了从0.02到0.09的文件夹。但是， 所有文件夹中的输入文件都是一样的，我们还需要把INCAR中的SIGMA参数值 SIGMA = 0.01 改成与文件夹对应的数值。 首先我们可以逐个进行编辑，但太浪费时间，这也不是大师兄的风格。Ex03练习分为2小节：

* 新命令 sed 的学习
* for + sed 组合

最终我们会结合for循环和sed命令，来学会批量处理输入文本的另一个方法。**还是要强调一下：**大家要主动，多去网上找资料，并系统性的学习linux下面的基本命令。光指望着本书中的这么一点，是很难提高的。



### 复习上一节的功课

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ ls
ex01  ex02
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ mkdir ex03 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ cp ex02/0.01 ex03 -r 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ cd ex03/0.01/
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR  
SYSTEM = O atom 
ISMEAR = 0       
SIGMA = 0.01      
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR  -n 
     1	SYSTEM = O atom 
     2	ISMEAR = 0       
     3	SIGMA = 0.01      
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ 

```

上面的操作依次为：

* 新建ex03文件夹

* 将ex02中的0.01 复制到ex03中
* 进入ex03/0.01的目录中
* 使用cat 查看0.01中INCAR的内容
* 使用cat -n 查看INCAR中的内容，该选项在输出中给每一行标出了行数，方便我们查看。

**注意:** 

1）Linux 下面的命令都有很多的选项，用以丰富我们的不同需求，比如上面的 cat -n，可以使用 man cat 这个命令查看 cat 的其他选项。使用这个命令后，如果想退出，敲 q 键即可;

2）另外，我们也可以使用 cat –help 来查看，效果与man cat 一样。



**sed 命令修改INCAR**

前面我们提到，可以使用vim打开INCAR然后修改SIGMA的参数。除了vim当然还有文本编辑器等其他的工具。但这些工具都有个缺点，就是得把文件打开后才能修改。下面我们使用sed命令，不打开文本，直接对里面的内容进行替换操作。

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ sed '3s/0.01/0.02/g' INCAR 
SYSTEM = O atom 
ISMEAR = 0       
SIGMA = 0.02      
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR  
SYSTEM = O atom 
ISMEAR = 0       
SIGMA = 0.01      
```

**精解：**

1) 	单引号中是我们的操作， 3s 表示的是选择第三行，因为我们知道 0.01 在第三行中出现，s 是substitute 的缩写
2)	3s 后面跟一个斜杠 /  用来和后面被替换的内容分开，这里0.01 表示选择第三行的0.01;

3)	0.01后面再用一个斜杠，将其和替换后的数字分开(0.01  0.02  0.03 等)，表示将0.01替换为斜杠后面的内容;

4)	再加一个斜杠，后面的g 代表 global ，意思是全部替换。

5)	输入完毕后，我们选择要执行该命令的对象(要替换的文件)，也就是当前目录下INCAR 文件。

6)	 命令的意思就是：我们用sed命令，将INCAR中的第三行的0.01全部替换成0.02。



从上面实例中最后的cat INCAR命令结果不难发现，实际上我们并没有将INCAR文件中的0.01替换成0.02。也就是说这个命令只是输出了替换后的结果，但没有更新INCAR文件。那怎么样才可以更新INCAR文件呢？ 我们可以这样做：

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ sed '3s/0.01/0.02/g' INCAR > INCAR_new
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR_new 
SYSTEM = O atom 
ISMEAR = 0       
SIGMA = 0.02      
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ mv INCAR_new  INCAR 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR  
SYSTEM = O atom 
ISMEAR = 0       
SIGMA = 0.02      
```

箭头（>）的意思是：我们将命令的输出存到一个新的文件INCAR_new中，

通过mv命令之前的INCAR替换掉。



但，这样做也太麻烦了，更简单一点，如下：

前面例子的INCAR中SIGMA的值已经不是0.01了，我们先从ex02/0.01中复制一个过来。

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cp ../../ex02/0.01/INCAR  .
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR  -n 
     1	SYSTEM = O atom 
     2	ISMEAR = 0       
     3	SIGMA = 0.01      
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ sed -i '3s/0.01/0.02/g' INCAR 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR  -n 
     1	SYSTEM = O atom 
     2	ISMEAR = 0       
     3	SIGMA = 0.02      
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ 

```

**详解：**

sed –i 是sed 的命令和其附加选项， -i 表示直接对源文件进行编辑，也就是说编辑之后源文件被新文件替换掉。因此，使用这个参数的时候要小心，小心，再小心。要格外小心！！！

* 最保险的做法就是运行前，先对操作的对象进行备份：如下：

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cp INCAR  INCAR_back
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ sed -i '3s/0.01/0.02/g' INCAR 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ ls
INCAR  INCAR_back  KPOINTS  POSCAR  POTCAR
```

* 其次是，先不加 -i 运行下sed命令，确保输出的是正确结果后，然后再加上 -i 运行.

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cp INCAR_back  INCAR 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ sed '3s/0.01/0.02/g' INCAR
SYSTEM = O atom 
ISMEAR = 0       
SIGMA = 0.02      
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ sed -i '3s/0.01/0.02/g' INCAR
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex03/0.01$ cat INCAR  -n 
     1	SYSTEM = O atom 
     2	ISMEAR = 0       
     3	SIGMA = 0.02    
```



**小结:**

sed 是一个非常强大的命令，对于做计算的我们来说，熟练正确地使用sed可以极大的提高我们的工作效率，大家务必硬着头皮掌握这个命令。这个网站列举了一些基本的用法：

**http://man.linuxde.net/sed** 

大家参照着进行练习，也可以百度里面搜索一些其他的 sed 使用技巧，如果你有认为很好的sed 技巧，也可以发邮件分享给大师兄（lqcata@gmail.com）。