---
title: Ex0 学习前的准备工作（二）
---



继续前面的介绍。



# **文本编辑工具**

### 1）[vim](https://www.vim.org/) 

这个必须要学会，linux下面自带。原因是绝大多数的计算都是在linux下面进行的，学会vim的基本操作可以极大提高你的文字处理能力和工作效率。



### 2) [notepad++](https://notepad-plus-plus.org/)

* 这个是对于Windows用户来说的，要求会创建文件,输入内容并保存文件，**这个软件必须学会使用!**

原因在于：Windows下面自带的记事本保存的文件与linux下的文件格式不匹配，提交任务的时候经常出问题，用notepad++则不会出现这个问题。

**因此**，记事本杜绝使用。为了安全，即使用了notepad++，Windows用户在进行计算的时候，也需要注意下面两点：

* Windows下面编辑的输入文件，如果想在linux服务器上运行，最好先执行: dos2unix 这个命令。

* Windows用户计算出错了，一定要首先想到 dos2linux 这个命令来解决问题!!!


### 3） [Atom](https://atom.io/)

这个Atom是文本编辑工具，不是原子的意思。Windows，Linux，Mac系统均可使用。要求会输入文件，保存文件。



# **常用建模相关软件:**

本书默认大家已经在自己的电脑里安装了下面三个软件：

### **1) Material Studio** 

* 这个软件，百度里面一大堆下载链接，安装教程，大家自行下载安装即可。

*  本书默认大家已经安装成功，会不会使用暂且不要求；
* 不要问我从哪里下载，安装出现问题也不要找我解决。



### 2）[**p4vasp**](http://www.p4vasp.at)

* 链接：[http://www.p4vasp.at/](http://www.p4vasp.at/)

- Windows版本，好像很久没有更新了，点击此处下载，解压,双击图标即可运行。也可以在大师兄QQ群或者其他QQ群文件中下载。

- Linux版本功能更加强大。可以

  Ubuntu用户使用命令一键安装： **sudo apt-get install p4vasp**

  也可以按照官网的说明，安装最新的版本：p4vasp 0.3.30

- Mac系统：本人没有经验，希望土豪分享下经验。

- 

### 3）**[VESTA](http://jp-minerals.org/vesta/en/)**  

* 来自日本的良心软件，Linux，Windows，Mac系统均可使用。链接：http://jp-minerals.org/vesta/en/
* Windows下面安装就不再介绍了，下载程序，解压，双击图标即可运行，相信大家都能搞定。

* Linux下安装: 

  - 下载binary程序文件，本人解压后放到了/opt/VESTA-x86_64目录

  - 编辑 ~/.bashrc 文件，在文件最后，添加下面2行。

  ```
  export VESTA=/opt/VESTA-x86_64 
  export PATH="$PATH:$VESTA"
  ```

  - 在终端里面进行的操作如下：第一行打开~/.bashrc文件, 自己添加上面提到的两行即可，第二行更新下~/bashrc文件，第三行运行VESTA。

  ```
  $ vim ~/.bashrc
  $ . ~/.bashrc
  $ VESTA
  ```


