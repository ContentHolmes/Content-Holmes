var data = require('../data/URLBlocker.js');

export {
    checkPresenceInBanned, add
};

var bannedElementsArray = data.bannedElementsArray;

function checkPresenceInBanned(url) {
    // checks the presence of the URL in the
    // 1. bannedElementsArray
    // 2. bannedURLs (from chrome local storage)
    var str = url;
    var bad = false;
    for (var i in bannedElementsArray) {
        if (bannedElementsArray[i] == str) {
            bad = true;
            return bad;
            break;
        }
    }
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var localBannedArray = items.global.bannedURLs;
        for (var j in localBannedArray) {
            // //console.log("inside step 1");
            // //console.log(localBannedArray[j]);
            if (str == localBannedArray[j]) {
                bad = true;
                ////console.log("inside step 2");
                return bad;
                break;
            }
        }
        return bad;
    });
}

function add(url) {
    chrome.storage.local.get(['settings', 'global'], function(items) {
            items.global.bannedURLs.push(url);
            chrome.storage.local.set({
                global: items.global
            });
            console.log("added a new URL to blocked sites: " + url);
            ////console.log(JSON.stringify(items.global.bannedURLs));
        });
}