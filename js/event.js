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
    global.dateBlocked = 18;
    global.initalInterval = 0;
    global.updatedTime = new Date();
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
    if (items.global.dateBlocked < date.getDate() || (date.getDate() == 1 && items.global.dateBlocked != 1)) {
        items.global.allBlocked = false;
        items.global.timeoutExpired = false;
        console.log('reset date' + items.global.dateBlocked + date.getDate());
        chrome.storage.local.set({
            global: items.global
        });
    }
});

function intervalStuff() {
    console.log("background check");
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var email = "mrigesh";
        var password = "mrigesh";
        var childName = "Rajat";
				var changedTime = new Date("Sat Feb 18 2017 21:42:50 GMT+0000 (GMT)");
				var changedInterval = 1;
				var blocked = true;
        $.ajax({
                url: "http://tfoxtrip.com/getBlockedURLs/?email=" + email + "&password=" + password + "&childName=" + childName,
                type: "GET"
                // Request body
            })
            .done(function(data) {
                console.log("data sent broooooo");
                console.log(JSON.stringify(data));
                var parsed = JSON.parse(JSON.stringify(data));
                if (parsed.success == true) {
                    items.global.tempBlockedURLs = parsed.URLArray;
                    console.log(JSON.stringify(items.global.tempBlockedURLs));
                }
            })
            .fail(function() {
                console.log("error pa ap ap ap ap a");
            });
        // $.ajax({
        //         url: "http://tfoxtrip.com/getBlockedURLs/?email=" + email + "&password=" + password + "&childName=" + childName,
        //         type: "GET"
        //         // Request body
        //     })
        //     .done(function(data) {
        //         console.log("data sent broooooo");
        //         console.log(JSON.stringify(data));
        //         var parsed = JSON.parse(JSON.stringify(data));
        //         if (parsed.success == true) {
        //             items.global.tempBlockedURLs = parsed.URLArray;
        //             console.log(JSON.stringify(items.global.tempBlockedURLs));
        //         }
        //     })
        //     .fail(function() {
        //         console.log("error pa ap ap ap ap a");
        //     });
        console.log("session " + items.global.sessionStarted);
        if (items.global.sessionStarted == true) {
            //check for changes
						if(items.global.updatedTime.getTime() < changedTime.getTime()){
                items.global.sessionTime += changedInterval - items.global.initialInterval;
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
            chrome.storage.local.set({
                global: items.global
            });
        } else {
            console.log('set timeout' + items.global.sessionTime);
            if (items.global.timeoutExpired) {
								if(changedTime != items.global.updatedTime){
										changedTime = items.global.updatedTime;
										if(!blocked){
											items.global.timeoutExpired = false;
										}
										items.global.allBlocked = false;
								}
                //check for new timeouts
            } else if (changedTime > items.global.updatedTime) {
								items.global.updatedTime = changedTime;
                items.global.allBlocked = false;
                items.global.sessionStarted = true;
								items.global.sessionTime = changedInterval;
            }
            //set initial timer
            chrome.storage.local.set({
                global: items.global
            });
        }
    });
}
intervalStuff();
var sessionTimer = setInterval(intervalStuff, 60000);
