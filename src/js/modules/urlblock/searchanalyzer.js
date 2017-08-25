/**
 * <tt>searchanalyzer</tt> analyzes search queries entered by the user in <b>any</b> search engine. It works with the URL that the search engines generate when serving search queries.
 * @example
 * <caption><tt>searchanalyzer</tt>'s use only requires a call to <tt>urlcheck</tt> with the URL of the search query.</caption>
 * var searchanalyzer = require('searchanalyzer.js');
 * searchanalyzer.urlcheck('https://www.youtube.com/results?search_query=content+holmes');
 * @module urlblock/searchanalyzer
 */

/**
 * Loads the NLP module. See {@link module:nlp/nlp}
 */
var nlp = require('../nlp/nlp.js');
/**
 * Loads searchanalyzer base data. See {@link module:data/searchanalyzer}
 */
var data = require('../data/searchanalyzer.js');
/**
 * Loads the bannedmanager. See {@link module:urlblock/bannedmanager}
 */
var banned = require('../urlblock/bannedmanager.js');

export {
    urlcheck
};

var words = data.words;

/**
 * Checks the URL to process it for information regarding search related data.
 * @param {String} url This is the full URL of the search engine after search has been performed.
 * @returns {Number} Ratio of profane words to the total number of words in the search query.
 */

function urlcheck(url) {
    var params = getUrlVars(url);
    if (params.q != null) {
        return paramscheck(params.q);
    } else if (params.search_query != null) {
        return paramscheck(params.search_query);
    } else if (params["field-keywords"] != null) {
        return paramscheck(params["field-keywords"]);
    } else {
        return 0;
    }
}

/**
 * Checks the search parameters for profane content. Also triggers interest determination!
 * @param {String} params The extracted search query from [getUrlVars]{@linkcode module:urlblock/searchanalyzer~getUrlVars}.
 * @returns {Number} Ration of profane words to the total number of words in the search query.
 */

function paramscheck(params) {
    var count = 0.0;
    var bad = 0.0;
    var extracts;
    params = params.replace(/[^\w\s]|_/g, '.');
    params = params.toLowerCase();
    var query = params.replace(/\./g, ' ');
    try {
        chrome.storage.local.get(['settings', 'global'], function(items) {
            nlp.setBuffer(items.global.interestBuffer);
            nlp.interest(items.global.interests, query, function(interests, data) {
                //console.log(interests);
                //console.log(JSON.stringify(data));
                items.global.interests = interests;
                items.global.interestBuffer = data;
                chrome.storage.local.set({
                    global: items.global
                });
                chrome.runtime.sendMessage({
                    type: "sendInterests",
                    interests: JSON.stringify(interests)
                });
            });
        });
    } catch (e) {

    } finally {

    }
    params = params.split('.');
    count = params.length;
    for (var i = 0; i < words.length; i++) {
        if (params.indexOf(words[i]) != -1) {
            bad++;
        }
    }
    for (var i = 0; i < count; i++) {
        banned.checkPresenceInBanned(params[i]).then(val => {
            if(val == true)
                bad++;
        }, err => {
            //console.log(err);
        });
    }
    return bad / count;
}

/**
 * Takes the URL and extracts all the parameters in the get request.
 * @param url The URL whose parameters need to be extracted.
 * @returns {Dictionary} All parameters in the URL.
 */

function getUrlVars(href) {
    var vars = [],
        hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    var hashes = href.slice(href.indexOf('#') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
