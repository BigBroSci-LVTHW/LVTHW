# Extension: siunitx for the MathJax third party repository

An implementation of the [siunitx package for LaTeX](http://www.ctan.org/pkg/siunitx) for [MathJax](https://github.com/mathjax/MathJax).

## #About siunitx

The siunitx package allows to typeset physical quantities consistently using the syntax `\SI{299e6}{\metre\per\second}`. This extension provides the same syntax in MathJax. Please see the [documentation for siunitx on CTAN](http://www.ctan.org/pkg/siunitx) for details about siunitx.

References:

- MathJax: http://www.mathjax.org/
- siunitx on CTAN: http://www.ctan.org/pkg/siunitx
- W3C note on Units in MathML: http://www.w3.org/TR/mathml-units/

### Using this extension

Since the shutdown of the MathJax CDN, this extension is not currently hosted on any CDN.
When using it in a production environment, please host it locally.
To try it out, you may use rawgit.
Then, add the extension to your configuration like any other third party extension. For example, your inline configuration might be

     <script type="text/x-mathjax-config>
     MathJax.Hub.Config({
       extensions: ["tex2jax.js","[siunitx]/siunitx.js"],
       jax: ["input/TeX","output/HTML-CSS"],
       tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
       TeX: {extensions: ["AMSmath.js","AMSsymbols.js", "sinuitx.js"]}
     });
     MathJax.Ajax.config.path['siunitx']  = 'http://rawgit.com/burnpanck/MathJax-siunitx/master/';
     </script>

### Example

We have a [listing of extracted code samples from the siunitx documentation](https://github.com/burnpanck/MathJax-siunitx/blob/master/examples/siunitx.dtx.html)
([see it live](http://rawgit.com/burnpanck/MathJax-siunitx/master/examples/siunitx.dtx.html))
that highlight a number of uses of this extension and provides static images rendered with `pdflatex`
and the `siunitx` package for comparison.
For debugging purposes, you may append `?unpacked` or `?modular` to the URL, making the page use the combined but not minified,
or even the modular original sources instead of the production level minified version of the extension.
