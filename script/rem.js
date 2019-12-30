(function(w) {
    w = w || 375;
    var sw = document.documentElement.clientWidth;
    sw = sw > 320 ? sw : 320;
    document.getElementsByTagName('html')[0].style.fontSize = Math.floor(sw/(w || 375) * 100) +'px';
})(375);
