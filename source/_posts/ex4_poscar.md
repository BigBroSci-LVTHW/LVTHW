---
title: Ex04 做计算常用的批量处理方法（六）
categories: 
- LVASPTHW
tags: 
- for 循环
- 批量处理
date: 2018-10-25 15:30:16
---

$\require{mediawiki-texvc}$


前面我们对INCAR，KPOINTS进行了批量操作，这一节，我们介绍对输入文件进行批量操作的最后一部分：POSCAR。 在这里，大师兄需要指出的是，批量操作的方式有很多种，大家千万不要仅仅局限在本书的例子里面，自己主动去思考这些命令的运行方式，将其运行的范围扩展，最后才能做到随心所欲，达到无招胜有招的境界。如果只跟着大师兄的教程去练习而不主动思考的话，时间长了思维就会被限制了。

 

此外，大师兄给的例子是都可以正确执行的，虽然易错的地方已经指出来了，但更希望大家主动去尝试自己理解不清楚的参数，主动去犯错，得到错误的结果时，印象会更加深刻些。有句古话说的好:纸上学来终觉浅，绝知此事要躬行。所以，行动是很有必要的。大家在此基础上多加尝试，尽可能多的犯错误，知道什么样的输入对应什么样的错误。

 

### POSCAR 批处理练习:

前面我们将O原子放到了一个8$\times$ 8$\times$8$\AA{^3}$ 的格子里。现在我们要创建不同大小的正方形格子，每个格子边长分别为8,10,12,14,16$\AA$。重复下面的操作，完成POSCAR的批量练习，并思考这些命令是怎么工作的。

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ mkdir poscar
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cd poscar/
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/poscar$ for i in $(seq 8 2 16); do cp -r ../../ex03/0.01 ${i}${i}${i} ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/poscar$ ls 
101010  121212  141414  161616  888
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/poscar$ cat -n 888/POSCAR 
     1	O atom in a box 
     2	1.0            
     3	8.0 0.0 0.0   
     4	0.0 8.0 0.0  
     5	0.0 0.0 8.0 
     6	O          
     7	1         
     8	Cartesian
     9	0 0 0           #
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/poscar$ for i in $(seq 8 2 16); do sed -i "3,5s/8/$i/g" ${i}${i}${i}/POSCAR ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/poscar$ cat -n 888/POSCAR      
1	O atom in a box 
     2	1.0            
     3	8.0 0.0 0.0   
     4	0.0 8.0 0.0  
     5	0.0 0.0 8.0 
     6	O          
     7	1         
     8	Cartesian
     9	0 0 0           #
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/poscar$ cat -n 101010/POSCAR 
     1	O atom in a box 
     2	1.0            
     3	10.0 0.0 0.0   
     4	0.0 10.0 0.0  
     5	0.0 0.0 10.0 
     6	O          
     7	1         
     8	Cartesian
     9	0 0 0           #
```

**命令详解:**

* seq 命令用来打印一系列的数字， 在这个例子中 seq 8 2 16 获取8到16之间的数字，间隔为2; 其中， 8  2 16 三个数字间需要用空格分开；看到这里你会想到之前我们使用的花括号 {}，对的，如果间隔是1的话， {1..9} 和 seq 1 1 9 以及 seq 1 9 是一样的; seq 1 9 中省略的是 seq 1 1 9 中间的 1，  因为它是默认值。但是这里我们数字的间隔是2，使用花括号则不能实现我们的目的。

* for 循环的精髓:  for i in  $(seq 8 2 16);  

  提醒1)：for循环这部分结束后，要跟一个是分号，不是冒号!!!

  提醒2): $ 和 后面的括号之间没有空格!!! 

  大家可以主动把分号改成冒号或者在$后面加个空格，看看会出什么错。

  在这里，调用seq 8 2 16这个命令的输出，我们用 到了\$()  这个组合。它的作用是: 调用一个命令或者函数的输出，进而转化为for循环的对象集合。for i in \$(seq 8 2 6) 等于for i in 8 10 12 14 16 。 

* 此外，你还会见到一些人使用 \` \` 这个符号(反单引号);  \`seq 8 2 16\`  的效果等于 \$(seq 8 2 16)。所以，当你见到 \` \` 时，不要害怕，因为你知道里面是在调用一个命令或者函数，和 $() 效果是一样的。Linux下面有很多奇奇怪怪的字符，当你知道他们的意思时就见怪不怪了。

* sed 命令，这里我们使用了 sed –i “3,5s/8/$i/g”  

  3,5s 的意思是：选择第三行到第五行中所有的8；然后将它们替换成$i； 

有很多筒子不知道怎么一次性选择三行中的内容，便运行了这和循环命令三次:

```
sed –i “3s/8.0/$i/g”
sed –i “4s/8.0/$i/g”
sed –i “5s/8.0/$i/g”
```

效果是一样的，但3,5s这样更简洁，优美。希望大家可以认真学习sed的使用，达到炉火纯青的地步。后面我们也会在计算过程中继续介绍sed是如何发挥作用的。



**为什么说这是 for 循环的精髓呢?**



从for循环的语法上看，有两个主要部分：

1）第一个是选取对象，也就是for i in XXX 语句中的 XXX 部分;

2）另一个是去执行的动作， do YYY ; 

对于do YYY 我们根据自己的要求或者要现实的目的，把命令填到YYY这一块就可以了。但是，对于前面的集合选取，这就需要大家脑洞大开了。最简单的是根据自己的任务要求选取合适的范围直接输入，比如 for i in 1 2 3 4 5 ;

再复杂些，我们使用一个函数，命令或者更高级的命令操作来得到所需范围，如本例中 for i in $(seq 8 2 16)。这个随着计算的进行，你的体会也就越来越深刻。



当我们准备计算输入文件，查看计算亦或者整理计算结果时，首先要对这些文件或者文件夹进行选择，即把需要处理的对象放在一起。为了保证for循环变量范围的高效选择，养成一个良好的计算习惯非常重要：那就是保持计算在不同目录下的一致性；也就是目录要规范，文件系统有序而整齐，根据不同的计算等级或者类型进行创建。如果文件夹一个套一个，随意创建，毫无规则可言，那么在用for循环的时候，工作效率就会大大地打折扣。



 在这里教给大家另外一个linux 命令：tree 来查看当前目录下的文件夹级别信息，用以给for循环提供合适的变量; (tree 和 tree -d， 尝试下有什么不同)

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ ls
kpoints  poscar
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ tree -d 
.
├── kpoints
│   ├── 111
│   ├── 222
│   ├── 333
│   ├── 444
│   ├── 555
│   └── 666
└── poscar
    ├── 101010
    ├── 121212
    ├── 141414
    ├── 161616
    └── 888

13 directories
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cd kpoints/
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/kpoints$ ls
111  222  333  444  555  666
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/kpoints$ tree  
.
├── 111
│   ├── INCAR
│   ├── KPOINTS
│   ├── POSCAR
│   └── POTCAR
├── 222
│   ├── INCAR
│   ├── KPOINTS
│   ├── POSCAR
│   └── POTCAR
├── 333
│   ├── INCAR
│   ├── KPOINTS
│   ├── POSCAR
│   └── POTCAR
├── 444
│   ├── INCAR
│   ├── KPOINTS
│   ├── POSCAR
│   └── POTCAR
├── 555
│   ├── INCAR
│   ├── KPOINTS
│   ├── POSCAR
│   └── POTCAR
└── 666
    ├── INCAR
    ├── KPOINTS
    ├── POSCAR
    └── POTCAR

6 directories, 24 files
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04/kpoints$ 
```

上面例子给出了一个非常清晰的文件目录结构。如果你在服务器上运行，发现下面的错误。且自己没有root权限安装tree这个命令，那么自动跳过这个练习或者在自己电脑的Linux系统上进行操作。

```
 tree
-bash: tree: command not found
```



### 总结

本节我们学习了:

1) seq 命令获取数字序列的方法;

2) 使用 $() 将括号里面命令的输出转为for循环变量的方法;

3) sed 一次性选择多行的方法。

4) 保持文件系统有序而整齐，提高for 循环处理任务的效率。



前面这几节没有直接进入计算部分，是因为我们的一句古话：工欲善其事必先利其器。进行理论计算，学会最基本的相关操作知识非常重要。从前面这几节的学习，你会发现：懂得使用一个命令，可以节省很多时间; 但如果你懂得如何进一步发挥这个命令的作用，那么它会更加节省你的时间。省下来的时间你可以去看书，运动，谈恋爱…等等。想想都是很美好的事情。记得本人刚读博士的时候，组里的一个博后给我说：如果你想偷懒，那么就必须多动脑! 大家可以在运行完命令后，仔细体会下这句话的思想。而大家主动学习怎么去偷懒是最重要的。当然基本的命令操作只是科研中的一个小利器而已，真正的利器在于你扎实的理论化学基本功。
