---
title: 通过关键词判断优化任务收敛
categories: 
- 个人经验
tags: 
- 收敛
- 优化
- OUTCAR
date: 2018-11-27 15:30:16
---



今天QQ群里，有人（小风）问怎么通过reached这样的关键词来判断自己的任务是否收敛。

首先：阿牛哥哥说说了，实现的方法有很多种？这大实话一点都不假！

然后：乐平老师说，问问题的人没有问用什么语言写？这Python高手深藏不漏。

紧接着：杠精大神用bash语言coding了一番，敲出若干行神秘的文字：

```
check=$(grep "reach" vasp.log | tail -1)
if [ "$check" == "" ];then
   echo "$n $i $j cp POSCAR CONTCAR" >> ../conver.log
   cp POSCAR CONTCAR
else
   echo "$n $i $j $check" >> ../conver.log
fi
```



下面我们就通过学习赋值和if语句来揭开上面的神秘文字。



### 原理

如果：f(A) = B，且f(C) = B，那么A的某一个性质 = C的某一个性质， 其中f() 是对操作对象在固定范围所实施的一个固定的方法。

也就是说对A和C进行同样的操作，同时都得到了B，那么说明A的某一个性质 = C的某一个性质 。

### 操作

我们写脚本的目的是要通过B来判断A与C的关系。

A是我们已知的结果；

C是我们未知的结果；

B也就是我们说的赋值的对象。

首先，我们看一个已经收敛的例子：

```bash
qli@bigbro:~/ch4$ grep reached OUTCAR
------------------------ aborting loop because EDIFF is reached ----------------------------------------
------------------------ aborting loop because EDIFF is reached ----------------------------------------
------------------------ aborting loop because EDIFF is reached ----------------------------------------
 reached required accuracy - stopping structural energy minimisation
 
```

我们知道，如果使用`grep reached OUTCAR`这个命令，我们会得到2个结果，一个是`aborting loop because EDIFF is reached`，暂且记为A1， 另一个是`reached required accuracy - stopping structural energy minimisation` ，暂且记为A2。如果一个优化任务收敛的话，我们是通过A2来判断的。那么现在我们就可以把A2名字改成A了。A有什么特点呢？ 我们随便列2个。

1） A在OUTCAR中只出现一次，且出现在最后一行。

2） A的第一个单词是reached。

现在，我们将reached这个单词赋值为B。也就是让B为收敛冠名，只要满足通过上面2个条件筛选出来的结果是B，就说明计算收敛了。

筛选这个操作怎么进行呢？ 

* 利用特点1）： 使用`tail` 这个命令。

```
qli@tekla2:~/ch4$ grep reached OUTCAR
------------------------ aborting loop because EDIFF is reached ----------------------------------------
------------------------ aborting loop because EDIFF is reached ----------------------------------------
------------------------ aborting loop because EDIFF is reached ----------------------------------------
 reached required accuracy - stopping structural energy minimisation
qli@tekla2:~/ch4$ grep reached OUTCAR  |tail -n 1
 reached required accuracy - stopping structural energy minimisation

```

* 利用特点2）：使用`cut`或者`awk`命令来获取第一个单词。

  ```bash
  qli@tekla2:~/ch4$ grep reached OUTCAR  |tail -n 1
   reached required accuracy - stopping structural energy minimisation
  qli@tekla2:~/ch4$ grep reached OUTCAR  |tail -n 1 | cut -c 2-8
  reached
  qli@tekla2:~/ch4$ grep reached OUTCAR  |tail -n 1 | awk '{print $1}'
  reached
  
  ```

* 判断C = B ? 

  ```bash
  qli@tekla2:~/ch4$ b='reached'
  qli@tekla2:~/ch4$ c=$(grep reached OUTCAR  |tail -n 1 | awk '{print $1}')
  qli@tekla2:~/ch4$ echo $c
  reached
  qli@tekla2:~/ch4$ c=`grep reached OUTCAR  |tail -n 1 | awk '{print $1}'`
  qli@tekla2:~/ch4$ echo $c
  reached
  qli@tekla2:~/ch4$ if [ c=b ]; then echo bigbro ; fi
  bigbro
  ```




