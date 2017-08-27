/** 
 * <tt>urlobserver</tt> observes the URL the user is currently on. It maintains a list of functions that are triggered as soon as the URL is changed in the address bar.
 * @example
 * <caption><tt>urlobserver</tt> is extremely easy to require and use. One such implementation is as follows:</caption>
 * var urlobserver = require('urlobserver.js');
 * urlobserver();
 * urlObserver.addCallback(function(url) {
 *	console.log("The new URL is "+url);
 *});
 * @module observer/urlobserver 
 */

module.exports = initializeObserver;
module.exports.addCallback = addCallback;

var prevURL = "";
var functions = [];

/**
 * The observer passed to MutationObserver that checks for new URL and if change occurs, executes all functions in the list.
 */

function observer() {
    if (prevURL.length == 0) {
        prevURL = document.location.href;
        // console.log("URLmutator1");
    } else {
        if (prevURL != document.location.href) {
            //console.log("prevURL : "+prevURL);
            prevURL = document.location.href;
            //console.log("finalURL : "+document.location.href);
            //console.log("URLmutator2");
            
            for(var i = 0; i < functions.length; i++) {
                functions[i](prevURL);
            }
        }
    }
}

/**
 * Initializes the URL Observer. <br>
 * Only one call is needed in the entire page.
 */

function initializeObserver() {
    try {
        new MutationObserver(observer).observe(document.body, {
            subtree: true,
            childList: true
        });

    } catch (e) {
        ////console.log("Some error in MutationObserver");
    }
}

/**
 * Adds callback function to the <tt>urlobserver</tt>. These functions are executed synchronously after the URL changes. <br>
 * The function can have one argument, the <b>new URL</b> the page goes to.
 */

function addCallback(callback) {
    functions.push(callback);
}