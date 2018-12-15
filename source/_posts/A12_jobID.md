---
title: A12 通过job-ID快速进入计算目录
categories: 
- LVASPTHW附录
tags: 
- 超算中心
- job-ID
- 快速进入
- 国科智算
date: 2018-12-15 15:30:16
---



通过job-ID快速进入计算目录，可以有效地避免狂输cd命令，提高我们的计算效率。本节我们通过在国科智算超算中心的演示，介绍一个Slurm任务管理系统，保存任务ID，计算目录，并快速根据ID进入计算目录的方法。



## 核心思想：

有很多种方法可以实现：通过Job-ID进入计算目录的办法。这里只介绍本节的思路。

* 通过`squeue` 命令获取用户所有的任务的ID；
* 通过`scontrol` 命令获取所有ID对应的计算目录
* 将计算ID，以及对应的目录保存到一个`txt`文件中。
* 通过在`~/.bashrc `中使用scource命令，激活`bash`脚本中进入目录的操作。

之所以将计算目录保存到`txt`文件中，是因为如果计算已经完成的话，则不可以通过`scontrol`命令来获取目录，这时候，我们就可以在`txt`文件中查找相应的信息。

## 准备流程

按照流程操作，每一步都很重要，漏掉的话，可能会导致功能无法实现。

1 下载脚本：

* 链接：https://pan.baidu.com/s/1FEHdOecGvShbspfn9B7fIw  提取码：dmd9 
* 国科智算QQ群文件：608307988 （申请试用）
* 大师兄QQ群文件：217821116

将`ent.sh` 和` job_check.py `复制到`~/bin` 目录下，赋予可执行权限。

```
gkzshpc101@login02:~/bin$ chmod  u+x ent.sh
gkzshpc101@login02:~/bin$ chmod  u+x job_check.py
```

2 在bin目录下创建一个：`job-check`的目录，以及在该目录中创建一个空的`job_list.txt`文件，用来存储我们的任务信息。

```bash
gkzshpc101@login02:~/bin$ mkdir job_check && touch job_check/job_list.txt
```

3 修改`job_check.py`脚本中

1）13行中的账户信息，`gkzshpc101`改成你自己的账户

2） 32行中的那个目录信息，改成下面目录输出的。

```bash
gkzshpc101@login02:~/bin$ cd job_check 
gkzshpc101@login02:~/bin/job_check$ pwd
/public1/home/gkzshpc101/bin/job_check
```

```python
#!/usr/bin/env python
'''
This script is used to
1) record the job_ID and directories
2) print the job path from the job_ID
'''
from subprocess import Popen, PIPE
import numpy as np
import sys

def get_id():
    list_j = [] # list for the job_ID
    process = Popen(['squeue', '-lu',  'gkzshpc101'], stdout=PIPE, stderr=PIPE)
    stdout, stderr = process.communicate()
    list_out =  stdout.split('\n')[2:]
    for i in range(0, len(list_out)-1):
        list_j.append(list_out[i].split()[0])
    return list_j

def get_dir(job_id):
    job_dir = None
    command = 'scontrol show job ' + job_id
    process1 = Popen(command, shell = True,  stdout=PIPE, stderr=PIPE)
    stdout1, stderr1 = process1.communicate()
    for i in stdout1.split('\n'):
        if 'WorkDir' in i:
            #job_dir.append(i.split('=')[1])
            job_dir = i.split('=')[1]
    return job_dir

id_dict = {}
with  open('/public1/home/gkzshpc101/bin/job_check/job_list.txt', 'a+') as file_in:
    lines = file_in.readlines()
    for line in lines:
        key = line.split(':')[0]
        value = line.split(':')[1]
        id_dict[key] = value

    list_j = get_id()

    for i in list_j:
        if i not in id_dict.keys():
            id_dict[i] = get_dir(i)
            file_in.write(i + ':' + get_dir(i) + '\n')

job_id = sys.argv[1]

for i in id_dict.keys():
    if job_id in i:
        print(id_dict.get(i).strip())

```



```bash
#!/usr/bin/env bash
pwd_work=$(job_check.py $1)
echo $pwd_work
cd $pwd_work
```



4 修改`~/.bashrc`文件，添加下面这一行：

```
alias ent='source ~/bin/ent.sh '
```

source 一下`~/.bashrc`文件： `. ~/.bashrc`



##  运行实例：

```bash
gkzshpc101@login02:~/test_ncore/test1/14$ ls
INCAR  KPOINTS POSCAR  POTCAR vasp.sh
gkzshpc101@login02:~/test_ncore/test1/14$ sbatch  vasp.sh
Submitted batch job 14999
gkzshpc101@login02:~/test_ncore/test1/14$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
             14999 operation     vasp gkzshpc1  R       0:02      1 c0077
gkzshpc101@login02:~/test_ncore/test1/14$ cd 
gkzshpc101@login02:~$ ent 999
/public1/home/gkzshpc101/test_ncore/test1/14
gkzshpc101@login02:~/test_ncore/test1/14$ ls
CHG  CHGCAR  CONTCAR  DOSCAR  EIGENVAL  IBZKPT  INCAR  KPOINTS  OSZICAR  OUTCAR  PCDAT  POSCAR  POTCAR  REPORT  vasp.out  vasprun.xml  vasp.sh  WAVECAR  XDATCAR
gkzshpc101@login02:~/test_ncore/test1/14$
```