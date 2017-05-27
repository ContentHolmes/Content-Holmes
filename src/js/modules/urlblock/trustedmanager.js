var data = require('../data/URLBlocker.js');

export {
    checkPresenceInTrusted, add
};

var trustedElementsArray = data.trustedElementsArray;

function checkPresenceInTrusted(url) {
    // checks the presence of url in
    // 1. trustedElementsArray
    // 2. trustedURLs (from chrome local storage)
    var str = url;
    var good = false;
    for (var i in trustedElementsArray) {
        if (trustedElementsArray[i] == str) {
            good = true;
            return good;
            break;
        }
    }
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var localTrustedArray = items.global.trustedURLs;
        for (var i in localTrustedArray) {
            if (localTrustedArray[i] == str) {
                good = true;
                return good;
                break;
            }
        }
        return good;
    });
}

function add(url) {
    chrome.storage.local.get(['settings', 'global'], function(items) {
        items.global.trustedURLs.push(getImageName(url));
        chrome.storage.local.set({
            global: items.global
        });
        console.log("added a new URL in the trusted sites list: ");
        //console.log(JSON.stringify(items.global.trustedURLs));
    });
}