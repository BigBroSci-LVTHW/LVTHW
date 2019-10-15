---
title: 浅谈Hall Petch关系(二)
categories: 
- 分享
tags: 
- Hall Petch
- ponychen
date: 2019-10-14 18:30:16
mathjax: true
---

在上文中，我们介绍了用于解释Hall Petch关系的位错阻塞模型和晶界位错源模型。两种理论都是较为早期出现的模型，原理上相对简单，因此文章中仔细介绍了相对应的推导过程。本文将继续介绍剩下的相关模型，由于推理过程相对复杂，读者如果对具体推导过程有兴趣可以阅读对应参考文献。

上文介绍的两种模型都未在公式中直接体现材料变形中塑性应变对Hall Petch系数的影响。因此，位错阻塞模型和晶界位错源模型仅仅只能描述多晶材料在屈服极限之下的情况。我们知道，当多晶材料所受应变超过其屈服极限，材料由于位错的交截和阻碍出现了加工硬化。加工硬化势必会影响Hall Petch系数的数值。在Meakin和Petch（文献1）提出的work haraening（加工硬化）模型中，Hall Petch系数被看成是一个与应变有关的因变量。

![](D:/bigbrosci.github.io/LVTHW-master/LVTHW/source/_posts/share05/share051.png)

由于Hall Petch系数中包含了应变，该模型同时成功预测了材料中的加工硬化行为。如果我们将晶粒尺寸d固定，可以发现该模型描述了一种应力与应变成抛物线形状的加工硬化关系，这与很多实验是相符合的。

目前为止介绍的所有模型都默认认为位错来自于位错源的开动。然而实际上，当晶体被弯曲，或者在晶粒之间的交叠以及孔洞处，由于非均匀变形，晶体为了降低变形带来的巨大应力，会自发形成一些几何必须位错来释放应力。下图展示:

![](D:/bigbrosci.github.io/LVTHW-master/LVTHW/source/_posts/share05/share052.png)

当晶体被弯曲时，晶体中自发在易滑移面上出现的几何必须位错林。在Ashby（文献2）等提出的几何必须位错模型中，作者认为晶界作为晶体中的应力协调区，其上的位错类型主要为几何必须位错主导，并且晶体中绝大部分的几何必须位错都位于晶界上，因此材料的强度由晶界上的几何必须位错密度决定。而平衡位错密度又由晶粒尺寸决定，通过结合加工硬化模型，作者获得了如下的Hall Petch关系式。

![](D:/bigbrosci.github.io/LVTHW-master/LVTHW/source/_posts/share05/share053.png)

位错阻塞模型将材料的强度归功于晶粒内部位错源开动的位错受阻，而目前介绍的其他模型则都将材料的强度归功于晶界处的位错密度受阻。在这两种极端情况的基础上，Meyersm（文献3）等人认为（复合模型），一个多晶材料应该被分为两部分：连续的拥有较高流变强度的晶界部分以及被晶界包围的离散的拥有较低流变强度的块体部分（见下图4，t为晶界厚度）。

![](D:/bigbrosci.github.io/LVTHW-master/LVTHW/source/_posts/share05/share054.png)

当材料承受外力时，晶界部分首先发生变形，形成大量几何必须位错；随着进一步变形，晶界首先发生局部屈服形成加工硬化层，并形核大量位错向晶粒内运动；最后，随着晶粒内位错密度的上升，晶粒部分发生屈服。至此，材料整体完成了整个塑性变形过程。基于这一过程假设，作者得出了如下关系。

![](D:/bigbrosci.github.io/LVTHW-master/LVTHW/source/_posts/share05/share055.png)

可以发现，该关系式并非符合正常的Hall Petch关系，式子中同时出现了一次方和二次方项。作者进一步假设随着晶粒尺寸的增大，其容纳几何必须位错的数量也在上升，因此其厚度t也在上升。基于这一假设，作者得到了下图的强度与晶粒尺寸的关系。

![](D:/bigbrosci.github.io/LVTHW-master/LVTHW/source/_posts/share05/share056.png)

可以发现，复合模型在晶粒尺寸较大的时候可以较好的匹配Hall Petch关系，而当晶粒尺寸小到纳米级的时候，复合模型成功预测了超细晶材料的强度反常降低现象的存在。这是之前所有的理论模型都无法给出的结果。

实际上，在复合模型之后材料学家依旧提出了大量的理论模型，其目的也不仅仅是在于解释Hall Petch关系。由于篇幅所限，本文仅仅介绍了一些具有代表性的模型。实际上，从实验的角度来说，很多材料也并非严格遵循Hall Petch关系中-1/2指数，该指数存在一个很大的范围。对于我们来说，-1/2只是代表材料强度与晶粒尺寸联系的一个优美符号。

1. Meakin, J., and N. J. Petch. "Report ASD-TDR-63-324." *Symposium on the Role of Substructure in the Mechanical Behavior of Metals,(ASD-7DR-63-324, Orlando, 1963) pp*. 1963.
2. Ashby, M. F. "The deformation of plastically non-homogeneous materials." *The Philosophical Magazine: A Journal of Theoretical Experimental and Applied Physics*21.170 (1970): 399-424.
3. Meyersm, Marc A., and E. Ashworth. "A model for the effect of grain size on the yield stress of metals." *Philosophical Magazine A* 46.5 (1982): 737-759.
4. Kato, Masaharu. "Hall–Petch relationship and dislocation model for deformation of ultrafine-grained and nanocrystalline metals." *Materials Transactions* 55.1 (2014): 19-24.