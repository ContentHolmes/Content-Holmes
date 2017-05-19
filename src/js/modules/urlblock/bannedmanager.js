var data = require('../data/URLBlocker.js');

export {
    checkPresenceInBanned
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