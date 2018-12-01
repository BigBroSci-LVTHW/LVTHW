---
title: 通过Ubuntu连接国科智算的方法
categories: 
- LVASPTHW附录
tags: 
- 超算中心
- sshfs
- Ubuntu
date: 2018-11-18 15:30:16
---



本教程主要讲述的是如何在Ubuntu16.04操作系统上连接国科智算超算。分3部分：

* 1）前期准备； 
* 2）连接和挂载超算中心； 
* 3）数据传输测试。

在使用本教程前，首先确认已经收到了超算管理员分配的秘钥。通过Vim或者其他文本编辑工具，可以查看一下这个秘钥。超算中心好比是一个宝藏，这个宝藏的大门上有把锁，而开启这把锁的钥匙，就是管理员给我们的秘钥。



### 前期准备

下面的工作，一步一步来，相信99.99% 的人都可以顺利完成。

* 为了方便理解，本人将管理员给的秘钥重新命名了一下。将下面的999改成管理员给你的那个数字。

```bash
qli@bigbro:~$ cp  ~/Desktop/id_rsa_gkzshpc999.gkzshpc999  .ssh/my_key
```

经过上面的一步，管理员给的秘钥就被我们命名成：my_key了。这好比是我们在钥匙上贴了个标签，开门的时候直接找这个标签对应的钥匙就可以了。

如果你的Ubuntu系统下没有 .ssh 文件夹，可以自己先建一个，然后再运行上面的命令

```bash
qli@bigbro:~$ mkdir .ssh
```

* 安装sshfs 

  ```bash
  qli@bigbro:~$ sudo apt-get install sshfs 
  [sudo] password for qli: 
  Reading package lists... Done
  Building dependency tree       
  Reading state information... Done
  ```

* 创建挂载国科智算的文件目录：

  ```bash
  qli@bigbro:~$ mkdir gkzs
  ```

* 打开~/.bashrc文件，并添加下面的两行：

  ```bash
  alias gkzs='ssh -i /home/qli/.ssh/my_key  gkzshpc999@59.49.37.9 -p 9236'
  alias mgkzs='sshfs -o IdentityFile=/home/qli/.ssh/my_key  -p 9236 gkzshpc999@59.49.37.9:  /home/qli/gkzs'
  ```

  上面我们的两行alias后面的内容主要为：

  * 我们的手（ssh）拿着钥匙（-i /home/qli/.ssh/my_key） 打开大门 （gkzshpc999@59.49.37.9 -p 9236）
  * 我们的手（sshfs）拿着钥匙 （-o IdentityFile=/home/qli/.ssh/my_key） 打开大门 （-p 9236 gkzshpc999@59.49.37.9）后，并将宝藏运回家（/home/qli/gkzs） 

* source 一下 ~/.bashrc 文件：

  ```bash
  qli@bigbro:~$ . ~/.bashrc
  ```


### 连接超算中心

上面的工作完成之后，剩下的就是命令操作的事情了：

* 连接超算中心：

  ```bash
  qli@bigbro:~$ ls
  Desktop  Documents  Downloads  gkzs  lvliang  Music  Pictures  Public  SCVPN  teklahome  Templates  Videos
  qli@bigbro:~$ gkzs
  Last login: Thu Nov 22 05:07:16 2018 from 80.29.50.15
  [gkzshpc999@login02 ~]$ ls
  perl5
  ```

* 打开新的一个Terminal，我们挂载超算中心到我们的电脑上面，以便传输数据。

```bash
qli@bigbro:~$ ls
Desktop  Documents  Downloads  gkzs  lvliang  Music  Pictures  Public  SCVPN  teklahome  Templates  Videos
qli@bigbro:~$ ls gkzs/
 
qli@bigbro:~$ mgksz
qli@bigbro:~$ ls gkzs/
perl5
```



### 数据传输测试

* 在连接到服务器的界面：我们创建一个文件：mount_test。

  ```bash
  [gkzshpc999@login02 ~]$ echo  'I love BigBro' >  mount_test
  [gkzshpc999@login02 ~]$ ls
  mount_test  perl5
  [gkzshpc999@login02 ~]$ cat mount_test 
  I love BigBro
  [gkzshpc999@login02 ~]$ 
  ```



* 在挂载的目录下查看：目录下多出来了刚刚创建的 mount_test文件。

  ```bash
  qli@bigbro:~$ cd  gkzs/
  qli@bigbro:~/gkzs$ ls
  mount_test  perl5
  qli@bigbro:~/gkzs$ cat mount_test 
  I love BigBro
  qli@bigbro:~/gkzs$ 
  qli@bigbro:~/gkzs$ cp ~/Desktop/CONTCAR  .
  qli@bigbro:~/gkzs$ ls
  CONTCAR  mount_test  perl5
  qli@bigbro:~/gkzs$ 
  ```

上面的最后操作中，我们从桌面上复制了一个CONTCAR到挂载的目录下，然后查看下服务器的终端：

```bash
[gkzshpc999@login02 ~]$ ls
CONTCAR  mount_test  perl5
[gkzshpc999@login02 ~]$ head -n 5 CONTCAR  
Ru\(0\0\1)                              
   1.00000000000000     
     8.1377999784000004    0.0000000000000000    0.0000000000000000
     4.0688999892000002    7.0475415119999996    0.0000000000000000
     0.0000000000000000    0.0000000000000000   21.5631999968999999
[gkzshpc999@login02 ~]$ 
```



完成了上面的操作，下面你就可以将自己电脑上准备的一些计算文件或者文件夹通过命令复制到超算中心，然后就可以提交任务了。