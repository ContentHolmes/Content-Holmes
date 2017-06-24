var nlp = require('../nlp/nlp.js');
var data = require('../data/searchanalyzer.js');
var banned = require('../urlblock/bannedmanager.js');

export {
    urlcheck
};

var words = data.words;

function urlcheck(url) {
    var params = getUrlVars(url);
    if (params.q != null) {
        return paramscheck(params.q);
    } else if (params.search_query != null) {
        return paramscheck(params.search_query);
    } else {
        return 0;
    }
}

function paramscheck(params) {
    var count = 0.0;
    var bad = 0.0;
    var extracts;
    params = params.replace(/[^\w\s]|_/g, '.');
    var query = params.replace(/\./g, ' ');
    try {
        chrome.storage.local.get(['settings', 'global'], function(items) {
            nlp.setBuffer(items.global.interestBuffer);
            nlp.interest(items.global.interests, query, function(interests, data) {
                console.log(interests);
                console.log(JSON.stringify(data));
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
            console.log(err);
        });
    }
    return bad / count;
}

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
