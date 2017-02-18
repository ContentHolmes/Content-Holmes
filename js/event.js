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
    global.sessionTime = 1;
    global.sessionStarted = true;
    global.timeoutExpired = false;
    global.allBlocked = true;
    global.dateBlocked = 17;
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
				console.log('reset date');
        chrome.storage.local.set({
            global: items.global
        });
    }
});

var timeout;
function intervalStuff(){
	console.log("background check");
	chrome.storage.local.get(['settings', 'global'], function(items) {
			console.log(items.global.sessionStarted);
			if (items.global.sessionStarted == true) {
					//check for changes
			} else {
					console.log('set timeout' + items.global.sessionTime);
					items.global.sessionStarted = true;
					timeout = setTimeout(function() {
							console.log('timeout over');
							items.global.allBlocked = true;
							chrome.storage.local.set({
									global: items.global
							});
					}, items.global.sessionTime * 60 * 1000);
					chrome.storage.local.set({
							global: items.global
					});
			}
	});
}
intervalStuff();
var sessionTimer = setInterval(intervalStuff, 60000);
