---
title: Ex04 做计算常用的批量处理方法（五）
categories: 
- LVASPTHW
tags: 
- for 循环
- 批量处理
date: 2018-10-24 15:30:16
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

前面的四点都是死死的基本Linux操作，而最后一点则是考验大家智商的时候。做计算，肯定避免不了会敲错命令，犯各种各样的错误。在避免出错方面，我们要认真掌握命令操作的关键点以及总结前面错误的经验；在错误的改正方面，我们要多多动脑子，及时想办法补救。众多补救的办法中，提前将操作的对象进行备份是最为有效的。比如，在前面例子中，由于在ex03中有备份的文件，即使在ex04目录犯错后，我们大不了全部删除，重新再来一遍。所以，在大家没有进行计算前，先提个醒：**一定要时刻牢记备份自己的文件**。