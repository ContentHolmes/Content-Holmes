var currentVersion = '2.0.10';

chrome.storage.local.get(['settings', 'global'], function(items) {
    var global = items.global || {};

    // Update icon
    // if( global.enabled ) {
    // 	chrome.browserAction.setIcon( { path: 'images/icon_19.png' } );
    // }
    // else {
    // 	chrome.browserAction.setIcon( { path: 'images/icon_19_disabled.png' } );
    // }

    if (global.version != currentVersion) {
        // Update version
        global.version = currentVersion;
        // Update some variables to their default value
        global.enabled = true;
        // set it as object {"date":"","URL":""}
        global.showChangelog = true;
    }
    global.tempBlockedURLs = [{
        URL: "facebook",
        time: "Sat Feb 18 2017 17:42:50 GMT+0000 (GMT)"
    }];
    global.timeoutExpired = false;
    global.sessionTime = 0;
    global.sessionStarted = false;
    global.allBlocked = false;
    global.dateBlocked = 0;
    global.initalInterval = 0;
    global.updatedTime = "";
    global.historyOfBlockedURLS = [];
    global.bannedURLs = [];
    global.trustedURLs = [];
    global.email = "";
    global.password = "";
    chrome.storage.local.set({
        global: global
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("something must happen right now");
    if (request.message == "sentiment") {
        console.log("sentiment will be fired");
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: "FireSentiment"
            }, function(response) {
                // console.log(response.message);
            });
        });
        console.log("this function ran");
        sendResponse({
            message: "good luck bro"
        });
    } else /*if(request.message == "redirect")*/ {
        console.log("I am here");
        chrome.tabs.update(sender.tab.id, {
            url: request.redirect
        });
        sendResponse({
            message: "good luck bro2"
        });
    }

});

chrome.storage.local.get(['settings', 'global'], function(items) {
    var date = new Date();
    console.log(items.global.dateBlocked);
    if (items.global.dateBlocked < date.getDate() || (date.getDate() == 1 && items.global.dateBlocked != 1)) {
        items.global.allBlocked = false;
        items.global.timeoutExpired = false;
        console.log('reset date' + items.global.dateBlocked + date.getDate());
        chrome.storage.local.set({
            global: items.global
        });
    }
});


var email, password, childName, dataAvailable = false;
var changedTime = "", changedInterval = 0, blocked = false;

function intervalStuff() {
    console.log("background check");
    chrome.storage.local.get(['settings', 'global'], function(items) {
        // var email = "mrigesh";
        // var password = "mrigesh";
        // var childName = "Rajat";
        // if(!(chrome.storage.local.get('info'))){
        // chrome.runtime.sendMessage({
        //     redirect: chrome.extension.getURL("/html/first.html")
        // });
        // }

        chrome.storage.local.get('info', function(item) {
            console.log(item.info);
            if (!item.info) {
                console.log('you r here');
                dataAvailable = false;
                chrome.tabs.create({
                    url: chrome.extension.getURL("/html/first.html")
                });
                // chrome.runtime.sendMessage({
                //     redirect: chrome.extension.getURL("/html/first.html")
                // });
            } else {
                dataAvailable = true;
                email = item.info.email;
                password = item.info.password;
                childName = item.info.childName;
            }
        });
        if (dataAvailable) {
            // var changedTime = (new Date("Sat Feb 19 2017 09:52:50 GMT+0000 (GMT)")).toString();
            console.log("changed time : " + changedTime);
            // var changedInterval = 5;
            // var blocked = false;
            var url = "http://tfoxtrip.com/getBlockedURLs/?email=" + email + "&password=" + password + "&childName=" + childName;
            // console.log("url is " + url);
            $.ajax({
                    url: "http://tfoxtrip.com/getBlockedURLs/?email=" + email + "&password=" + password + "&childName=" + childName,
                    type: "GET"
                    // Request body
                })
                .done(function(data) {
                    console.log('username' + email);
                    console.log("data got broooooo url block");
                    // console.log(JSON.stringify(data));
                    var parsed = JSON.parse(JSON.stringify(data));
                    if (parsed.success == true) {
                        items.global.tempBlockedURLs = parsed.URLArray;
                        // console.log(JSON.stringify(items.global.tempBlockedURLs));
                        chrome.storage.local.set({
                            global: items.global
                        });
                    }
                })
                .fail(function() {
                    console.log("error pa ap ap ap ap a");
                });
            $.ajax({
                    url: "http://tfoxtrip.com/getsession/?email=" + email + "&password=" + password + "&childName=" + childName,
                    type: "GET"
                    // Request body
                })
                .done(function(data) {
                    console.log("data got broooooo session");
                    console.log(JSON.stringify(data));
                    var parse2 = JSON.parse(JSON.stringify(data));
                    if (parse2.success == true) {
                        var parsed = JSON.parse(JSON.stringify(parse2.session));
                        // console.log(JSON.stringify(parsed));
                        changedTime = parsed.lastUpdated;
                        changedInterval = parsed.sessionTime;
                        blocked = parsed.isUpdated;
                        console.log(blocked);
                    }
                })
                .fail(function() {
                    console.log("error pa ap ap ap ap a");
                });
            console.log("session " + items.global.sessionStarted);
            if (items.global.sessionStarted == true) {
                //check for changes
                if(!blocked){
                  items.global.sessionStarted = false;
                  items.global.allBlocked = false;
                  items.global.timeoutExpired = true;
                }else{
                  if (items.global.updatedTime != changedTime) {
                    items.global.sessionTime = changedInterval;
                    items.global.initialInterval = changedInterval;
                    items.global.updatedTime = changedTime;
                  }
                  if (items.global.sessionTime == 0) {
                    items.global.sessionStarted = false;
                    items.global.allBlocked = true;
                    items.global.timeoutExpired = true;
                    console.log("Session Over");
                  } else
                  items.global.sessionTime -= 1;
                  console.log(items.global.sessionTime);
                }
                chrome.storage.local.set({
                    global: items.global
                });
            } else {
                // console.log('set timeout' + items.global.sessionTime);
                // console.log("timeout over" + items.global.timeoutExpired);
                // console.log("updated time" + items.global.updatedTime);
                if (items.global.timeoutExpired) {
                    if (changedTime != items.global.updatedTime) {
                        console.log("expired");
                        if (blocked) {
                            console.log("not blocked");
                            changedTime = items.global.updatedTime;
                            items.global.timeoutExpired = false;
                            items.global.allBlocked = false;
                        } else {
                            items.global.allBlocked = false;
                        }
                        // console.log("Interval started ");
                    }
                    //check for new timeouts
                } else if (changedTime != items.global.updatedTime) {
                  console.log("start");
                  // console.log('start');
                  // console.log(blocked == true);
                    if(blocked){
                      console.log("start with new time" + changedTime + items.global.updatedTime.toString());
                      items.global.updatedTime = changedTime;
                      items.global.allBlocked = false;
                      items.global.sessionStarted = true;
                      items.global.sessionTime = changedInterval;
                      console.log("Interval is : " + changedInterval + " @ " + changedTime);
                    }
                }
                //set initial timer
                chrome.storage.local.set({
                    global: items.global
                });
            }
        }
    });
}
intervalStuff();
var sessionTimer = setInterval(intervalStuff, 6000);
