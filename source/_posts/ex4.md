---
title: Ex04 做计算常用的批量处理方法（五）
categories: 
- LVASPTHW
tags: 
- for 循环
- 批量处理
date: 2017-10-24 15:30:16
---



前面2节，我们学习了使用sed命令结合for循环，来对INCAR进行批量操作。同样，我们也可以对KPOINTS文件进行类似的批处理操作。本节，我们借对KPOINTS文件的操作，一方面，学习几个小窍门，另一方面回顾上一节的学习内容以及KPOINTS文件。



#### KPOINTS文件

前面我们学习到，KPOINTS文件只有简单的几行，如下：

```
K-POINTS  
0  
Gamma
1 1 1
0 0 0 
```



目前，对于大家来说，需要掌握的有以下点：

* 会自己闭着眼把这几行写出来；

* 第三行的gamma代表的是gamma centered的意思；
* 第四行中的1 1 1 俗称gamma点。很多时候，在QQ群里面提问题，别人说用gamma点算一下，指的就是1 1 1；
* 除了使用gamma点，我们还可以使用其他的数值，比如2 2 2，3 3 3， 1 2 3 等，数值越大，计算量也就越大。具体的要根据你自己的体系以及组里的计算能力来确定，这个我们后面会介绍；

* 对于气体分子或者原子的计算来说，也就是把它们放到一个格子的体系，使用gamma点就足够了。



本节，我们主要对KPOINTS的文件的第四行进行批量操作，将1 1 1改成 2 2 2， 3 3 3 等。首先浏览下面的命令：

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ ls
ex01  ex02  ex03
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW$ mkdir ex04 && cd ex04
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6}; do cp ../ex03/0.01/ ${i}${i}${i} -r ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ ls 
111  222  333  444  555  666
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cat 333/KPOINTS  -n 
     1	K-POINTS  
     2	 0  
     3	Gamma
     4	1 1 1
     5	0 0 0 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6}; do sed -i '4s/1 1 1/$i $i $i/g' $i/KPOINTS ; done 
sed: can't read 1/KPOINTS: No such file or directory
sed: can't read 2/KPOINTS: No such file or directory
sed: can't read 3/KPOINTS: No such file or directory
sed: can't read 4/KPOINTS: No such file or directory
sed: can't read 5/KPOINTS: No such file or directory
sed: can't read 6/KPOINTS: No such file or directory
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cat 333/KPOINTS  -n 
     1	K-POINTS  
     2	 0  
     3	Gamma
     4	1 1 1
     5	0 0 0 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6}; do sed -i '4s/1 1 1/$i $i $i/g' ${i}${i}${i}/KPOINTS ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cat 333/KPOINTS  -n 
     1	K-POINTS  
     2	 0  
     3	Gamma
     4	$i $i $i
     5	0 0 0 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ 
```



**详解：**

* 第三行：我们使用了 mkdir  ex04 && cd ex04 这个命令。 && 的作用是将两个命令连起来运行，如果&&前面的命令运行成功，则继续后面的命令。这里我们先运行了mkdir ex04的命令，然后通过cd进入新建的ex04这个文件夹目录下。但如果前面的命令运行不成功，我们还想运行第二个命令，那么可以用 ||这个将两个命令联系起来。百度自己搜索：&&  和 ||的使用，多多练习，可以提高你敲命令的工作效率。

* 我们使用for循环，将ex03中的0.01文件夹复制成111， 222， 333等。这里我们在调用for 循环中的变量i的时候，使用的是${i}。为什么要加花括号呢？ 这是为了避免\$i和后面的连在一起，从而导致调用失败。比如下面的命令：

  ```
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6}; do echo $iA; done 
  
  
  
  
  
  
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6}; do echo ${i}A; done 
  1A
  2A
  3A
  4A
  5A
  6A
  iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ 
  ```

* 后面的命令中，我们得到了这样的错误：sed: can't read 1/KPOINTS: No such file or directory。原因是我们的问价夹中有3个数字，我们需要调用$i三次，但写\$i/KPOINTS就会引用一次，导致sed的命令对象不正确。
* 改正之后，我们发现INCAR中的1 1 1 全部被替换成\$i \$i \$i了。这里是大师兄故意犯了的错误：将双引号变成了单引号。到现在，单引号和双引号的区别，相信大家在练习完之后能大体知道个所以然了。



上面的练习中，我们没有成功将 1 1 1改成文件夹对应的数字，那么改怎么做呢？ 有下面2个方法：

**方法1：** 将ex04的文件夹全部删掉，然后从新来过，如下：

```

iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ ls 
111  222  333  444  555  666
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ rm * -fr
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ ls
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6}; do cp ../ex03/0.01/ ${i}${i}${i} -r ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ ls 
111  222  333  444  555  666
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6}; do sed -i "4s/1 1 1/$i $i $i/g" ${i}${i}${i}/KPOINTS ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cat 333/KPOINTS  -n 
     1	K-POINTS  
     2	 0  
     3	Gamma
     4	3 3 3
     5	0 0 0 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ 
```

**方法2：**将错就错，在错误的基础上，把\$i \$i \$i 批量替换成文件夹对应的数字：

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ ls
111  222  333  444  555  666
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cat 222/KPOINTS  
K-POINTS  
 0  
Gamma
$i $i $i
0 0 0 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ for i in {1..6} ; do sed -i "s/\$i \$i \$i/$i $i $i/g" $i$i$i/KPOINTS ; done 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ cat 222/KPOINTS  
K-POINTS  
 0  
Gamma
2 2 2
0 0 0 
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ 
```

* 这里我们没有用\${i}，而是直接\$i\$i\$i连在一起用了。说明这个时候，花括号有或者没有，对命令行影响不大。

* sed 操作的难点在于区别\$i是调用的参数还是要被替换的字符上。例子中我们用一个反斜杠 \\ 将\$i转义成字符，进而避免将其按照变量来处理。说白了，就是让\$ 这个符号变成一个纯文字符号，而不再发挥调用变量的作用。这一部分的知识，大家自行百度搜索：Linux 转义符 进行学习。

再举个例子：如果被替换的内容中含有 /  , 直接输入则会被认为是分隔符,因此我们需要将其作为分隔符的作用去掉。怎么做呢? 输入\/ (一个反斜杠加单斜杠,中间没有空格),这样的话 / 就会被当成字符来处理啦! 大家好好琢磨下面的这个命令，我们要把big/bro中的/替换为\。如果你能理解了，转义符就基本入门了。

```
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ echo big/bro 
big/bro
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ echo big/bro | sed 's/\//\\/g'
big\bro
iciq-lq@ln3:/THFS/home/iciq-lq/LVASPTHW/ex04$ 
```

* 这里我们用了一个|，中文名字叫管道符，它的作用是将前面命令的输出结果传递给后面的命令，用作操作对象。百度自行搜索：Linux 管道符



### 总结

在本节的操作中，我们可以学到很多知识，私以为对于一个新手来说，这一节的内容难度有些大，需要认真操作，思考，查阅相关的资料。简单总结一下，本节需要掌握的内容有：

* &&，||  和 | 的用法 

*  ${i} 中什么时候用花括号，什么时候不用

*  sed 中的单引号，双引号的区别;

* 转义符在字符处理中的作用。

* 如何避免命令出错，以及出错后改怎么改正。

前面的四点都是死死的基本Linux操作，而最后一点则是考验大家智商的时候。做计算，肯定避免不了会敲错命令，犯各种各样的错误。在避免出错方面，我们要认真掌握命令操作的关键点以及总结前面错误的经验；在错误的改正方面，我们要多多动脑子，及时想办法补救。众多补救的办法中，提前将操作的对象进行备份是最为有效的。比如，在前面例子中，由于在ex03中有备份的文件，即使在ex04目录犯错后，我们大不了全部删除，重新再来一遍。所以，在大家没有进行计算前，先提个醒：**一定要时刻牢记备份自己的文件**。---
title: Ex04 做计算常用的批量处理方法（六）
categories: 
- LVASPTHW
tags: 
- for 循环
- 批量处理
date: 2017-10-25 15:30:16
mathjax: true
---

$\require{mediawiki-texvc}$


前面我们对INCAR，KPOINTS进行了批量操作，这一节，我们介绍对输入文件进行批量操作的最后一部分：POSCAR。 在这里，大师兄需要指出的是，批量操作的方式有很多种，大家千万不要仅仅局限在本书的例子里面，自己主动去思考这些命令的运行方式，将其运行的范围扩展，最后才能做到随心所欲，达到无招胜有招的境界。如果只跟着大师兄的教程去练习而不主动思考的话，时间长了思维就会被限制了。

 

此外，大师兄给的例子是都可以正确执行的，虽然易错的地方已经指出来了，但更希望大家主动去尝试自己理解不清楚的参数，主动去犯错，得到错误的结果时，印象会更加深刻些。有句古话说的好:纸上学来终觉浅，绝知此事要躬行。所以，行动是很有必要的。大家在此基础上多加尝试，尽可能多的犯错误，知道什么样的输入对应什么样的错误。

 

### POSCAR 批处理练习:

前面我们将O原子放到了一个8$\times$ 8$\times$8 $\AA{^3}$ 的格子里。现在我们要创建不同大小的正方形格子，每个格子边长分别为8,10,12,14,16$\AA$。重复下面的操作，完成POSCAR的批量练习，并思考这些命令是怎么工作的。

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
