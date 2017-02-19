// document.getElementsByTagName('body')[0].style.visibility = 'hidden';
// console.log("first" + "/\\b" + "Hello" + "\\b/gi");

chrome.storage.local.get(['settings', 'global'], function(items) {
    var date = new Date();
    if (items.global.allBlocked == true) {
        console.log('session over' + items.global.allBlocked);
        chrome.runtime.sendMessage({
            redirect: chrome.extension.getURL("/html/sessionExpired.html")
        });
    }
});


var fn2 = function() {
    if (document.getElementsByTagName('body')[0] != null) {
        document.getElementsByTagName('body')[0].style.display = 'none';
        console.log("hidden ho gaya");
        clearInterval(inter2);
    }
};
fn2();
var inter2 = setInterval(fn2, 100);
