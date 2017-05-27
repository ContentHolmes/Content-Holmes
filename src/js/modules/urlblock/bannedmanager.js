var data = require('../data/URLBlocker.js');
var md5 = require('md5');
var lfu = require('lfu-cache')(1000, 3600*24*10);

export {
    checkPresenceInBanned, add
};

var bannedElementsArray = data.bannedElementsArray;

function checkPresenceInBanned(url) {
    // checks the presence of the URL in the
    // 1. bannedElementsArray
    // 2. bannedURLs (from chrome local storage)
    var str;
    if(url) {
        str = url;
    } else {
        return false;
    }
    for (var i in bannedElementsArray) {
        if (bannedElementsArray[i] == str) {
            return true;
            break;
        }
    }
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var localBannedCache = items.global.bannedURLs;
        lfu.import(localBannedCache);
        if(getLFUCache(str)) {
            return true;
        }
        if(items.global.bannedURLObj[md5(str)]) {
            return true;
        }
        return false;
    });
    //Server call goes here
}

function add(url) {
    setLFUCache(url);
    chrome.storage.local.get(['settings', 'global'], function(items) {
        items.global.bannedURLs = lfu.export();
        chrome.storage.local.set({
            global: items.global
        });
        console.log("added a new URL to blocked sites: " + url);
    });
    //Server call goes here
}

function setLFUCache(url) {
    lfu.set(md5(url),{url: url});
}

function getLFUCache(url) {
    return lfu.get(md5(url));
}

lfu.on('eviction', function(key, object) {
    chrome.storage.local.get(['settings', 'global'], function(items) {
        items.global.bannedURLObj[key] = object["url"];
        chrome.storage.local.set({
            global: items.global
        });
        console.log("added a new URL to blocked sites: " + url);
    });
});