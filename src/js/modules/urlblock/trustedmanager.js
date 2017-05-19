var data = require('../data/URLBlocker.js');

export {
    checkPresenceInTrusted
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