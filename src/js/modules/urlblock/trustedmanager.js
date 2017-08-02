/**
 * <tt>trustedmanager</tt> manages trusted content providers. It uses a combination of local and online processing to reduce the time taken to find trusted sites in constant time complexity <b>O(k)</b>.<br>
 * Although the exposed functions for the module are only <tt>add</tt> and <tt>checkPresenceInTrusted</tt>, their implementation uses a variety of data-structures. Some of them being:
 * <ol>
 *  <li> <b>Array:</b> for base data of most visited sites.
 *  <li> <b>LFU-Cache:</b> for frequently visited sites by the user.
 *  <li> <b>Hashtable:</b> for items that aren't frequent, but accessed at some point of time.
 * </ol>
 * @todo Add a server datastructure aggregating all websites and add an asynch call side by side
 * @example
 * <caption>To include <tt>trustedmanager</tt>, just use require like:</caption>
 * var trusted = require('trustedmanager.js');
 * @module urlblock/trustedmanager
 */

/**
 * Imports data for base array from data modules. See {@link module:data/URLBlocker}
 */

var data = require('../data/URLBlocker.js');
var md5 = require('md5');
var lfu = require('lfu-cache')(1000, 3600*24*10);

export {
    checkPresenceInTrusted, add
};

var trustedElementsArray = data.trustedElementsArray;

/**
 * Checks for the presence of a provided URL in <tt>trustedmanager</tt>.
 * @param {String} URL to check in <tt>trustedmanager</tt>
 * @returns {Promise} A promise that returns a boolean true or false occording to whether the URL is present. It returns an error if rejected.
 * @example
 * trusted.checkPresenceInTrusted("https://www.google.com").then(result => {
 *  if(result) {
 *      console.log("Good");
 *  } else {
 *      console.log("Bad"); 
 *  }
 * });
 */

function checkPresenceInTrusted(url) {
    // checks the presence of url in
    // 1. trustedElementsArray
    // 2. trustedURLs (from chrome local storage)
    return new Promise(function(resolve, reject){
        var str;
        if(url) {
            str = url;
        } else {
            reject("Bad URL");
            return;
        }
        for (var i in trustedElementsArray) {
            if (trustedElementsArray[i] == str) {
                resolve(true);
                return;
            }
        }
        chrome.storage.local.get(['settings', 'global'], function(items) {
            var localTrustedCache = items.global.trustedURLs;
            lfu.import(localTrustedCache);
            if(getLFUCache(str)) {
                resolve(true);
                return;
            }
            if(items.global.trustedURLObj[md5(str)]) {
                resolve(true);
                return;
            }
            resolve(false);
            return;
        });
    });
}

/**
 * Adds a URL to the <tt>trustedmanager<\tt> asynchronously.
 * @param {String} URL that needs to be added
 * @example
 * trusted.add("http://www.google.com");
 */

function add(url) {
    setLFUCache(url);
    chrome.storage.local.get(['settings', 'global'], function(items) {
        items.global.trustedURLs = lfu.export();
        chrome.storage.local.set({
            global: items.global
        });
        //console.log("added a new URL to trusted sites: " + url);
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
        items.global.trustedURLObj[key] = object["url"];
        chrome.storage.local.set({
            global: items.global
        });
        //console.log("added a new URL to trusted sites: " + url);
    });
});
