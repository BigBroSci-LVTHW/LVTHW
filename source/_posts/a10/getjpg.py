# -*- coding:utf-8 -*-

import re
import urllib
from glob import glob
import os

def getmd():
    for md in glob("*.md"):
        file_object = open(md,'r')
        try:
            all = file_object.read()
        finally:
            file_object.close()
            i=md.rstrip(".md")
    return all,i

def getImg(html,i):
    reg = r'\!\[\]\((.*?)\)'
    imgre = re.compile(reg)
    imglist = re.findall(imgre,html)
    x = 1
    for imgurl in imglist:
        basename=imgurl.split('.')[-1]
        tupian='%s-%s.%s' % (i,x,basename)
        urllib.urlretrieve(imgurl,tupian)
        #old="![](%s)"%imgurl
        #new='<div align=center><img src="%s" /></div>' %tupian
        html=html.replace(imgurl,'%s/%s' %(i,tupian))#'%s/%s' %(i,tupian))
        #transimg(tupian)
        #os.remove(tupian)
        
        x+=1
    with open('%s-new.md'%i,'w') as writer:
        writer.write(html)
    return imglist
html,i = getmd()
getImg(html,i)


