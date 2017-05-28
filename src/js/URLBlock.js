var data = require('./modules/data/URLBlocker.js');
var banned = require('./modules/urlblock/bannedmanager.js');

var bannedElementsArray = data.bannedElementsArray;

chrome.storage.local.get(['settings', 'global'], function(items) {
    //console.log('blocked is ' + items.global.allBlocked);
    if (items.global.allBlocked == true) {
        //console.log('session over' + items.global.allBlocked);
        chrome.runtime.sendMessage({
            type: "redirect",
            redirect: chrome.extension.getURL("/html/sessionExpired.html")
        });
    }
});

var email, pass, name;
var isInfoAvailable = false;
var urlString;

function checkURL(url) {
    banned.checkPresenceInBanned(url).then(val => {
        console.log('resolved');
        if(val == true){
            console.log("yes");
            blockURL(url);
        }
    }, err => {
        if(err){
            console.log('error');
            console.log(err);
            return;
        }
    });
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var tempBannedURLs = items.global.tempBlockedURLs;
        // //console.log(tempBannedURLs.length);
        var u;
        for (u = 0; u < tempBannedURLs.length; u++) {
            // console.log(u);
            var parsed = JSON.parse(JSON.stringify(tempBannedURLs[u]));
            var tempURL2 = parsed.url;
            // console.log(tempURL2);
            if (tempURL2) {
                if (tempURL2.split(" ").length == 1) {
                    var tempURL = tempURL2;
                    // console.log('temp url is' + tempURL + parsed.time.toString());
                    var time1 = new Date(parsed.time.toString());
                    var time2 = new Date();
                    // console.log("time is " + time1 + "   " + "curr time is " + time2 + "  " + time1.getTimezoneOffset() + "   " + time2.getTimezoneOffset());
                    var time = new Date(time1.valueOf() + time1.getTimezoneOffset() * 60000);
                    var curr_time = new Date(time2.valueOf() + time2.getTimezoneOffset() * 60000);
                    // console.log("curr time is " + curr_time + "time is " + time + " time 123123");
                    if (time.getTime() < curr_time.getTime()) {
                        // console.log('old');
                        items.global.tempBlockedURLs.splice(u, 1);
                        u--;
                        chrome.storage.local.set({
                            global: items.global
                        });
                    } else if (tempURL == url) {
                        redirectURL();
                    }
                }
            } else {
                items.global.tempBlockedURLs.splice(u, 1);
                u--;
                chrome.storage.local.set({
                    global: items.global
                });
            }
        }
    });
}

function blockURL(url) {
    // //console.log('blocked');
    //console.log('info is ' + isInfoAvailable);
    chrome.runtime.sendMessage({
        type: "sendReport",
        url: url
    });
    redirectURL();
}

function redirectURL() {
    chrome.runtime.sendMessage({
        type: "redirect",
        redirect: chrome.extension.getURL("/html/safetypage.html")
    });
}

urlString = document.location.href;
const regex = /\/\/w{0,3}\.?(.*)\.\w{1,4}\/.*/gi;
urlString = urlString + "/";
var name = regex.exec(urlString);
try {
    urlString = name[1];
    checkURL(urlString);
} catch (err) {
    //console.log("regex error" + err);
}
// //console.log('url block');
