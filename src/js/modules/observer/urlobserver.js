module.exports = initializeObserver;
module.exports.addCallback = addCallback;

var prevURL = "";
var functions = [];

function observer() {
    if (prevURL.length == 0) {
        prevURL = document.location.href;
        // console.log("URLmutator1");
    } else {
        if (prevURL != document.location.href) {
            //console.log("prevURL : "+prevURL);
            prevURL = document.location.href;
            //console.log("finalURL : "+document.location.href);
            //console.log("URLmutator2");
            
            for(var i = 0; i < functions.length; i++) {
                functions[i](prevURL);
            }
        }
    }
}

function initializeObserver() {
    try {
        new MutationObserver(observer).observe(document.body, {
            subtree: true,
            childList: true
        });

    } catch (e) {
        ////console.log("Some error in MutationObserver");
    }
}

function addCallback(callback) {
    functions.push(callback);
}