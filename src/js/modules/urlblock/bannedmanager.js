/**
 * <tt>bannedmanager</tt> manages banned content providers. It uses a combination of local and online processing to reduce the time taken to find banned sites in constant time complexity <b>O(k)</b>.<br>
 * Although the exposed functions for the module are only <tt>add</tt> and <tt>checkPresenceInBanned</tt>, their implementation uses a variety of data-structures. Some of them being:
 * <ol>
 *  <li> <b>Array:</b> for base data of most visited sites.
 *  <li> <b>LFU-Cache:</b> for frequently visited sites by the user.
 *  <li> <b>Hashtable:</b> for items that aren't frequent, but accessed at some point of time.
 * </ol>
 * @todo Add a server datastructure aggregating all websites and add an asynch call side by side
 * @example
 * <caption>To include <tt>bannedmanager</tt>, just use require like:</caption>
 * var banned = require('bannedmanager.js');
 * @module urlblock/bannedmanager
 */

/**
 * Imports data for base array from data modules. See {@link module:data/URLBlocker}
 */

var data = require('../data/URLBlocker.js');
var md5 = require('md5');
var lfu = require('lfu-cache')(1000, 3600*24*10);

export {
    checkPresenceInBanned, add
};

var bannedElementsArray = data.bannedElementsArray;

/**
 * Checks for the presence of a provided URL in <tt>bannedmanager</tt>.
 * @param {String} URL to check in <tt>bannedmanager</tt>
 * @returns {Promise} A promise that returns a boolean true or false occording to whether the URL is present. It returns an error if rejected.
 * @example
 * banned.checkPresenceInBanned("https://www.google.com").then(result => {
 *	if(result) {
 *		console.log("Good");
 *  } else {
 *		console.log("Bad");	
 * 	}
 * });
 */

function checkPresenceInBanned(url) {
    // checks the presence of the URL in the
    // 1. bannedElementsArray
    // 2. bannedURLs (from chrome local storage)
    return new Promise(function(resolve, reject){
      var str;
      if(url) {
          str = url;
          //console.log('good');
      } else {
          reject("bad url");
          return;
      }
      //console.log('str is ' + str);
      for (var i in bannedElementsArray) {
          if (bannedElementsArray[i] == str) {
              resolve(true);
              return;
          }
      }
      chrome.storage.local.get(['settings', 'global'], function(items) {
          var localBannedCache = items.global.bannedURLs;
          lfu.import(localBannedCache);
          //console.log('imported lfu');
          if(getLFUCache(str)) {
              //console.log('resolving true');
              resolve(true);
              return;
          }
          if(items.global.bannedURLObj[md5(str)]) {
              //console.log('resolving true');
              resolve(true);
              return;
          }
          //console.log('resolving false');
          resolve(false);
          return;
      });
    });
    //Server call goes here
}

/**
 * Adds a URL to the <tt>bannedmanager</tt> asynchronously.
 * @param {String} URL that needs to be added
 * @example
 * banned.add("http://www.google.com");
 */

function add(url) {
    setLFUCache(url);
    chrome.storage.local.get(['settings', 'global'], function(items) {
        items.global.bannedURLs = lfu.export();
        chrome.storage.local.set({
            global: items.global
        });
    });
    //Server call goes here
    // Server call already exists in the form of sendReport in events
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
        //console.log("added a new URL to blocked sites: " + url);
    });
});
