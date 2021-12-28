---
title: Ubuntu18.使用VESTA报错的解决办法
categories: 
- 个人经验
tags: 
- Ubuntu
- VESTA
date: 2017-11-27 15:30:16
---



今天在Ubuntu18的版本上用了一下VESTA，发现17.XX版本的问题还依然存在。

当你敲命令：`VESTA`之后，会得到包含下面信息的错误。

`error while loading shared libraries libpng12.so.0`



解决步骤：

1）点下面的链接，下载libpng12的deb文件。

https://packages.debian.org/jessie/amd64/libpng12-0/download

2）双击下载的deb文件，安装即可。

3）再用命令打开VESTA就不会出错了。