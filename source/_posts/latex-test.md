---
title: LaTeX 支持测试页面
date: 2017-09-12 10:38:56
tags: LaTeX
categories: test
mathjax: true
---

# 这是一个 Jacman 主题对 $\LaTeX$ 支持测试页面

只需要在文章开头的 `front-matter` 部分加入 `mathjax: true` 即可开启 $\LaTeX$ 支持.

然后就可以愉快地使用 $\LaTeX$ 玩耍了~

$$
F = ma
$$


$$
i\hbar\frac{\partial \psi}{\partial t} = 
  \frac{-\hbar^2}{2m} \left(  \frac{\partial^2}{\partial x^2} + \frac{\partial^2}{\partial y^2} +
  \frac{\partial^2}{\partial z^2} \right) \psi + V \psi.
$$

# 使用 `siunitx` 包中的命令

$\num{1+-2i}$

$\si{kg.m.s^{-1}}$

$\si[per-mode=symbol]{\kilogram\metre\per\ampere\per\second}$

$\si[per-mode = fraction]{\cancel\kilogram\metre\per\cancel\kilogram\per\second}$
