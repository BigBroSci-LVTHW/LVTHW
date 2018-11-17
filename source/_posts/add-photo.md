---
title: 图片添加测试
date: 2018-09-17 00:26:50
tags: 添加图片
category: test
---

# 如何在不使用外部图床的情况下插入图片等资源文件?

1. 在hexo根目录执行 `hexo new 'article-name'` ;
2. `cd source/_posts` 就可以看到生成了 `article-name.md` 和 `article-name` 文件夹
3. 将资源文件放入 `article-name` 文件夹内,然后在 md 文件中使用相对路径引用即可,如
`![](add-photo/test.jpg)`

![](add-photo/test.jpg)
