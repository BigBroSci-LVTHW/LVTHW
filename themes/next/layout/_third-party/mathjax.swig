{% if theme.mathjax.enable %}
  {% if not theme.mathjax.per_page or (page.total or page.mathjax) %}

    <script type="text/x-mathjax-config">
      MathJax.Hub.Config({
        extensions: ["tex2jax.js","[siunitx]/siunitx.js"],
        TeX: {
          extensions: [
            "AMSmath.js","AMSsymbols.js", "sinuitx.js", "[mhchem]/mhchem.js"
          ]
        },
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {
          inlineMath: [ ['$','$'], ["\\(","\\)"]  ],
          processEscapes: true,
          skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        }
      });
      MathJax.Ajax.config.path['siunitx']  = '/js/MathJax-siunitx';
      MathJax.Ajax.config.path["mhchem"] = "https://cdnjs.cloudflare.com/ajax/libs/mathjax-mhchem/3.3.0";
    </script>

    <script type="text/x-mathjax-config">
      MathJax.Hub.Queue(function() {
        var all = MathJax.Hub.getAllJax(), i;
        for (i=0; i < all.length; i += 1) {
          all[i].SourceElement().parentNode.className += ' has-jax';
        }
      });
    </script>

    <script type="text/javascript" src="{{ theme.mathjax.cdn }}"></script>
  {% endif %}
{% endif %}
