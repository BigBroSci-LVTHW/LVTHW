#!/usr/bin/python
from __future__ import division,print_function

import os
import subprocess
import sys
import io

import bs4

template = r"""\documentclass[varwidth]{standalone}

\usepackage{xcolor}
\usepackage{siunitx}

\begin{document}
%s
\end{document}
"""

def myhash(src):
    ret = 0
    for c in src:
        ret =( ((ret << 5) - ret) + ord(c)) & 0xffffffff
    return ret

def compile_snippet(base,snip,fn=None,force=False):
    src = template%snip
    if fn is None:
        fn = '%08x'%myhash(snip)
    print('Compiling file "%s" from "%s"'%(fn,snip))
    fn = os.path.join(
        base,
        fn
    )
    if os.path.exists(fn+'.svg') and not force:
        return fn
    with open(fn+'.tex','w') as fh:
        fh.write(src)   
    try:
        output = subprocess.check_output(
            ['pdflatex',
            '-interaction','nonstopmode',
            '-output-directory',os.path.dirname(fn),
            fn],
            timeout=5,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as ex:
        print('Command output: ',ex.output.decode('utf-8'))
        return None
    subprocess.check_call([
        'pdftocairo',
        '-svg',
        fn+'.pdf',fn+'.svg'
    ])        
    return fn


def compile_testfile(fn):
    src = os.path.abspath(fn)
    basedir = os.path.join(
        os.path.dirname(fn),
        'latex-output'
    )
    if not os.path.exists(basedir):
        os.mkdir(basedir)
    with open(fn) as fh:
        for line in fh:
            line = line.split('%',1)[0].strip()
            if not line:
                continue
            compile_snippet(basedir,line)

def svg_extract_defs(fname,thedefs=dict()):
    from bs4 import BeautifulSoup
    
    with open(fname,'r') as fh:
        soup = BeautifulSoup(fh,'xml')
    theids = dict()
    nd = 0
    for defs in soup.find_all('defs'):
        defs.extract()
        for el in defs.find_all(id=True):
            el.extract()
            id = el.attrs.pop('id')
            element_code = el.prettify()
            element_hash = hash(element_code)
            el['id'] = 'unified-def-%08x'%(element_hash&0xffffffff)
            theids[id] = element_hash
            thedefs[element_hash] = el
            nd += 1
    for use in soup.find_all('use'):
        old = use['xlink:href']
        id = old[1:]
        new = '#unified-def-%08x'%(theids[id]&0xffffffff)
        use['xlink:href'] = new
    
    return soup


def extract_LaTeXdemo(dtxfile):
    ret = []
    cur = None
    with open(dtxfile,'r') as fh:
        for line in fh:
            if line.strip() == r'%\begin{LaTeXdemo}':
                cur = []
                continue
            if line.strip() == r'%\end{LaTeXdemo}' and cur:
                ret.append((''.join(cur)).rstrip())
                cur = None
                continue
            if cur is not None:
                assert line.startswith('%')
                cur.append(line[1:])
    return ret


    
def write_example(fname,snippets,template=None):    
    from bs4 import BeautifulSoup

    def NT(parent,new,**attrs):
        tag = list(parent.parents)[-1].new_tag(new)
        tag.attrs.update(attrs)
        parent.append(tag)
        return tag

    basedir = os.path.abspath(os.path.dirname(__file__))
    if template is None:
        template = os.path.join(basedir,'sample-template.html')
    with open(template,'r') as fh:
        soup = BeautifulSoup(fh)
    parent = soup.find(id='unittest')
    thedefs = {}
    for k,snip in enumerate(snippets):
        fn = compile_snippet(
            os.path.join(basedir,'latex-output'),
            snip
        )
        row = NT(parent,'tr')
        NT(NT(row,'td'),'pre').append(snip)
        imgcell = NT(row,'td')
        if fn is not None:        
            svg = svg_extract_defs(fn+'.svg',thedefs).svg
            svg.extract()
            svg['class'] = 'tex-example'
            imgcell.append(svg)
        NT(row,'td').append('\\( '+snip+' \\)')

    defs = NT(NT(soup.body,'svg'),'defs')
    for el in sorted(thedefs.keys()):
        defs.append(thedefs[el])
        

    with open(fname,'w') as fh:
        fh.write(soup.prettify())
        
     
if __name__ == '__main__':
    for fn in sys.argv[1:]:
        compile_testfile(fn)

