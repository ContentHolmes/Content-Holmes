// document.getElementsByTagName('body')[0].style.visibility = 'hidden';
console.log("first" + "/\\b" + "Hello" + "\\b/gi");
var inter2 = setInterval(function() {
    if (document.getElementsByTagName('body')[0] != null) {
        document.getElementsByTagName('body')[0].style.display = 'none';
        console.log("hidden ho gaya");
        clearInterval(inter2);
    }
}, 1);
