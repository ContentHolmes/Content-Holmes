var data = require('./modules/data/URLBlocker.js');

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


function checkURL() {
    urlString = document.location.href;
    const regex = /\/\/w{0,3}\.?(.*)\.\w{1,4}\/.*/gi;
    urlString = urlString + "/";
    var name = regex.exec(urlString);
    try {
        urlString = name[1];
    } catch (err) {
        //console.log("regex error" + err);
    }
    for (var i in bannedElementsArray) {
        if (bannedElementsArray[i] == urlString) {
            //console.log('match1');
            blockURL();
            break;
        }
    }
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var localBannedArray = items.global.bannedURLs;
        //console.log('these many sites' + localBannedArray.length);
        for (var j in localBannedArray) {
            //console.log(localBannedArray[j]);
            if (urlString == localBannedArray[j]) {
                //console.log('match2');
                blockURL();
                break;
            }
        }
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
                    } else if (tempURL == urlString) {
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

function blockURL() {
    // //console.log('blocked');
    //console.log('info is ' + isInfoAvailable);
    chrome.runtime.sendMessage({
        type: "sendReport",
        url: urlString
    });
    redirectURL();
    // chrome.storage.local.get('info', function(items) {
    //     if (!items.info) {
    //         email = "default";
    //         pass = "default";
    //         name = "default";
    //         redirectURL();
    //     } else {
    //         //console.log('info available');
    //         isInfoAvailable = true;
    //         //console.log('i am here 2.0');
    //         var sendobj = {
    //             type: "URL",
    //             email: items.info.email,
    //             password: items.info.password,
    //             childName: items.info.childName,
    //             time: new Date(),
    //             value: urlString
    //         };
    //         //console.log("here is the date "+sendobj.time);
    //         chrome.runtime.sendMessage({
    //             type: "sendReport",
    //             sendReport: JSON.stringify(sendobj)
    //         });
    //         redirectURL();
    //     }
    // });
    // if (isInfoAvailable) {
    // //console.log('i am here 2.0');
    // var sendobj = {
    //     type: "URL",
    //     email: email,
    //     password: pass,
    //     childName: name,
    //     time: new Date(),
    //     value: urlString
    // }
    // $.ajax({
    //         url: "https://www.contentholmes.com/childReport",
    //         beforeSend: function(XhrObj) {
    //             XhrObj.setRequestHeader("Content-Type", "application/json");
    //         },
    //         type: "POST",
    //         data: JSON.stringify(sendobj)
    //     })
    //     .done(function(data) {
    //         //console.log("data sent to server");
    //         redirectURL();
    //     })
    //     .fail(function() {
    //         //console.log("error in server upload");
    //         redirectURL();
    //     });
    // chrome.runtime.sendMessage({
    //     type: "report",
    //     sendReport: JSON.stringify(sendobj)
    // });
    // }
    // redirectURL();
}

function redirectURL() {
    chrome.runtime.sendMessage({
        type: "redirect",
        redirect: chrome.extension.getURL("/html/safetypage.html")
    });
}
// //console.log('url block');
checkURL();
