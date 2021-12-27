/**
 * Created by yves on 27.06.16.
 */

(function(){
    var script_path;
    var need_requirejs = false;

    function getURLParameter(name) {
        return decodeURIComponent(
            (
                new RegExp('[?|&](' + name + '(=[^&;]+?)?)(&|#|;|$)').exec(location.search) || ['']
            )[0].replace(/\+/g, '%20')
        ) || null;
    }

    if(getURLParameter('modular')){
        script_path = 'unpacked/siunitx-amd.js';
        need_requirejs = true;
    } else if(getURLParameter('unpacked')){
        script_path = 'unpacked/siunitx.js';
    } else {
        script_path = 'siunitx.js';
    }

    var config = document.querySelector('script[type="text/x-mathjax-config"]');
    config.textContent = config.textContent.replace(/(unpacked\/)?siunitx(-amd)?.js/,script_path);

    var pos = document.currentScript;
    var before = pos.nextElementSibling;
    if(need_requirejs){
        var requirejsel =  document.createElement('script');
        requirejsel.onload = function() {
            requirejs.config({baseUrl:'../unpacked'});
            MathJax.Hub.Configured();
        };
        requirejsel.src = "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js";
        pos.parentElement.insertBefore(requirejsel,before);
    } else {
        MathJax.Hub.Configured();
    };
})();

