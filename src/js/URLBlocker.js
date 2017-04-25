// //console.log(getName("https://www.google.co.in/?gfe_rd=cr&ei=K6GoWIjwDqT98weHn7WQCQ&gws_rd=ssl"));
var nlp = require('./modules/nlp/nlp.js');
var data = require('./modules/data/data.js');

var no_of_checks = 0;
var bannedElementsArray = data.bannedElementsArray;

var trustedElementsArray = data.trustedElementsArray;

var words = data.query;

var categories = data.categories;
// Three different arrays :
// bannedElementsArray : contains every site that we have banned from visiting
// trustedElementsArray : contains every site that we trust
// words : all the bad words are here
var imagesArray = document.getElementsByTagName("img");
var checkedImagesArray = [];
var hiddenImagesArray = [];
var checkCount = 0;
var globalBadCount = 0;
var globalGoodCount = 0;
var qualifiedImagesArray = [];
// var email, pass, name;
var blockedit = false;
// var isInfoAvailable = false;

// chrome.storage.local.get('info', function(items) {
//     if (!items.info) {
//         email = "default";
//         pass = "default";
//         name = "default";
//     } else {
//         isInfoAvailable = true;
//         email = items.info.email;
//         pass = items.info.password;
//         name = items.info.childName;
//     }
// });
////console.log("value of blocked it at initialization is: " + blockedit);

function BlockURL() {
    /*
          WORKING OF THIS FUNCTION:
          1. Get the settings and global elements from chrome local storage
                for all the elements in bannedElementsArray, check if any of the string matches the "urlString".
                  If "yes":
                    set blocked it to true ,
                    block the page cause its a porn site,
                    send the blocked site url to the server for storing the data,
                  (TO DO)  put the URL in the bannedurls array in global items
                    Break out of the loop
          2. Check the presence of urlstring in dyanmic array stored locally in chrome : bannedURLs
            if "yes" block it.
          3. Check if the child's parent has blocked any site explicitly
    */

    var urlString = getName(document.location.href);
    //console.log('url string' + urlString);

    blockedit = checkPresenceInTrusted(urlString);
    if (blockedit) {
        //console.log('trust');
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
        return;
    } else {
        //console.log('nudecheck');
        checkNudeImages();
    }
}

function getName(str) {
    const regex = /\/\/w{0,3}\.?(.*)\.\w{1,4}\/.*/gi;
    str = str + "/";
    var name = regex.exec(str);
    //console.log('regex');
    ////console.log(name[1]);
    try {
        return name[1];
    } catch (err) {}
}

function getImageName(str) {
    const regex = /\/\/.{1,3}\.([^\/]*)\.\w{1,4}\//g;
    var name = regex.exec(str);
    try {
        return name[1];
    } catch (err) {}
}


//###################################################################################################################

//  first check if the safe search if true of not



function checkNudeImages() {
    no_of_checks = 0;
    checkCount = 0;
    // Send only the first 10 images (that qualify the other checks like size)to the server for checking adult content
    // For every image source get the name using getName and checkpresence in banned and trusted
    for (var k in imagesArray) {
        try {
            var url = getImageName(imagesArray[k].src);
        } catch (err) {
            //console.log("error in images");
        }
        //console.log("URL image is:" + url);
        if (checkPresenceInBanned(url)) {
            imagesArray[k].style.visibility = "hidden";
            // //console.log("Hid the image: " + imagesArray[k].src);
        } else if (!checkPresenceInTrusted(url)) {
            ////console.log("not trusted");
            if ((imagesArray[k].clientWidth > 300 || imagesArray[k].clientHeight > 300) && checkCount <= 10) {
                ////console.log("IMAGE MUST BE CHECKED:\n" + imagesArray[k].src);
                // send the images to check for adult content to caption-bot api
                NudeCheck(imagesArray[k]);
                checkCount++;
            }
        }
    }
    if (checkCount == 0) {
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
    }
    // //console.log('check count2' + checkCount);
}

function NudeCheck(image) {
    var params = {
        "visualFeatures": "Adult",
        "language": "en",
    };
    var url = {
        url: image.src
    };
    $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
            beforeSend: function(xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "82535cdc5d3849cea09575b48b3b1e98");
            },

            type: "POST",
            data: JSON.stringify(url),
            // Request body
        })
        .done(function(data) {
            validateNudeResults(data, image);
        })
        .fail(function() {
            failreturn();
        });
}

function failreturn() {
    no_of_checks++;
    if (no_of_checks == checkCount) {
        // //console.log("end here");
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
    }
}

function validateNudeResults(data, image) {
    // if bad -> blur using index increase badcount
    // if good ->increase good count
    // if globalBadCout==5, put it in local sotage usin getName
    // if put in local storage trusted  using getName
    if (data.adult.isAdultContent) {
        globalBadCount++;
        try {
            image.style.visibility = "hidden";
        } catch (err) {
            //console.log(err);
        }
    } else {
        globalGoodCount++;
    }
    if (globalBadCount == 3) {
        chrome.runtime.sendMessage({
            type: "sendReport",
            url: getName(document.location.href)
        });
        // if (isInfoAvailable) {
        //     var sendobj = {
        //         type: "URL",
        //         email: email,
        //         password: pass,
        //         childName: name,
        //         time: new Date(),
        //         value: getName(document.location.href)
        //     }
        //     $.ajax({
        //             url: "https://www.contentholmes.com/childReport",
        //             beforeSend: function(XhrObj) {
        //                 XhrObj.setRequestHeader("Content-Type", "application/json");
        //             },
        //             type: "POST",
        //             data: JSON.stringify(sendobj)
        //             // Request body
        //         })
        //         .done(function(data) {
        //             //console.log("data sent to server from URLblocker");
        //         })
        //         .fail(function() {
        //             // //console.log("error in request to server");
        //         });
        // }

        chrome.storage.local.get(['settings', 'global'], function(items) {
            items.global.bannedURLs.push(getImageName(image.src));
            chrome.storage.local.set({
                global: items.global
            });
            //console.log("added a new URL to blocked sites: " + image.src);
            ////console.log(JSON.stringify(items.global.bannedURLs));
        });
        // //console.log('going to safetypage');
        chrome.runtime.sendMessage({
            type: "redirect",
            redirect: chrome.extension.getURL("/html/safetypage.html")
        });
    } else if (globalGoodCount == 10) {
        chrome.storage.local.get(['settings', 'global'], function(items) {
            items.global.trustedURLs.push(getImageName(image.src));
            chrome.storage.local.set({
                global: items.global
            });
            //console.log("added a new URL in the trusted sites list: " + images.src);
            //console.log(JSON.stringify(items.global.trustedURLs));
        });
    }
    no_of_checks++;
    // //console.log('check count' + checkCount);
    if (no_of_checks == checkCount) {
        // //console.log("end here");
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
    }
}

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
    // //console.log("present in bad: " + bad);
    // return bad;
}

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
/*  The following function check for the different bad-words in the search query of various search engines and blocks the URL if present*/
function urlcheck(url) {
    checkInterest();
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
    // if (params.includes("+")) {
    //     params = params.split("+");
    // } else {
    //     params = params.split("%");
    // }
    params = params.replace(/[^\w\s]|_/g, '.');
    var query = params.replace(/\./g, ' ');
    try {
        chrome.storage.local.get(["settings", "global"], function(items) {
            nlp.setBuffer(items.global.interestBuffer);
            nlp.interest(items.global.interests, query, function(interests, data) {
                console.log(interests);
                console.log(JSON.stringify(data));
                items.global.interests = interests;
                items.global.interestBuffer = data;
                chrome.storage.local.set({
                    global: items.global
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
        if (checkPresenceInBanned(params[i])) {
            bad++;
        }
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

function checkInterest() {
    var metaTags = document.getElementsByTagName("meta");
    var scores = {
        "Entertainment": 0,
        "Music": 0,
        "Art": 0,
        "Vehicles": 0,
        "Beauty": 0,
        "Sports": 0,
        "Science & Education": 0,
        "Pets & Animals": 0,
        "Social": 0,
        "News": 0,
        "Games": 0,
        "Technology": 0,
        "Books": 0
    };
    var bannedSet = {};
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var u;
        var tempBannedURLs = items.global.tempBlockedURLs;
        for (u = 0; u < tempBannedURLs.length; u++) {
            // console.log(u);
            var parsed = JSON.parse(JSON.stringify(tempBannedURLs[u]));
            var tempURL2 = parsed.url;
            // console.log(tempURL2);
            if (tempURL2) {
                if (tempURL2.split(" ").length > 1) {
                    var tempURL = tempURL2.split(" ")[0];
                    // //console.log('temp url is' + tempURL);
                    var time1 = new Date(parsed.time.toString());
                    var time2 = new Date();
                    var time = new Date(time1.getTime() + time1.getTimezoneOffset() * 60000);
                    var curr_time = new Date(time2.getTime() + time2.getTimezoneOffset() * 60000);
                    // //console.log(curr_time + time + "time123123");
                    if (time.getTime() < curr_time.getTime()) {
                        items.global.tempBlockedURLs.splice(u, 1);
                        u--;
                        chrome.storage.local.set({
                            global: items.global
                        });
                    } else {
                        var tempURL3 = tempURL.toLowerCase();
                        bannedSet[tempURL3] = 1;
                    }
                }
            } else {
                items.global.tempBlockedURLs.splice(u, 1);
                u--;
                chrome.storage.local.set({
                    global: items.global
                });
            }
        }
        console.log(JSON.stringify(bannedSet));
        for (var i = 0; i < metaTags.length; i++) {
            if (metaTags[i].getAttribute("name")) {
                if (metaTags[i].getAttribute("name").toLowerCase() == "keywords" || metaTags[i].getAttribute("name").toLowerCase() == "description") {
                    //console.log(metaTags[i].getAttribute("content"));
                    var vals = metaTags[i].getAttribute("content").toString().replace(",", " ").replace(".", " ").replace("-", " ");
                    // console.log(vals);
                    if (vals) {
                        for (var cat in categories) {
                            var name = cat;
                            var subs = categories[cat];
                            var sub_strong = subs["Strong"];
                            var sub_weak = subs["Weak"];
                            var strong = false;
                            var disabled = false;
                            for (var j in sub_strong) {
                                var subcat = sub_strong[j].toLowerCase();
                                if (bannedSet.hasOwnProperty(subcat)) {
                                    // console.log('banned bro' + name + "   " + subcat);
                                    disabled = true;
                                }
                                // console.log(subcat);
                                var reg = new RegExp(".*" + "\\b" + subcat + "\\b" + ".*", "gi");
                                // console.log(reg);
                                // console.log(vals.match(reg));
                                if (vals.match(reg)) {
                                    // console.log('Strong Match');
                                    // console.log("Cat is " + cat + ", Subcat is " + subcat);
                                    scores[name] += 2;
                                    strong = true;
                                } else {
                                    // console.log("not " + subcat);
                                }
                            }
                            if (strong) {
                                if (disabled) {
                                    console.log("banned 123 " + name);
                                    chrome.runtime.sendMessage({
                                        type: "redirect",
                                        redirect: chrome.extension.getURL("/html/safetypage.html")
                                    });
                                    return;
                                }
                                for (var j in sub_weak) {
                                    // //console.log(subs[j] + " is " + vals.indexOf(subs[j]));
                                    var subcat = sub_weak[j].toLowerCase();
                                    // console.log(subcat);
                                    var reg = new RegExp(".*" + "\\b" + subcat + "\\b" + ".*", "gi");
                                    // console.log(reg);
                                    // console.log(vals.match(reg));
                                    if (vals.match(reg)) {
                                        scores[name] += 1;
                                        // console.log('Weak Match');
                                        // console.log("Cat is " + cat + ", Subcat is " + subcat);
                                    } else {
                                        // console.log("not " + subcat);
                                    }
                                }
                            }
                        }
                    }
                    //console.log("Final interest is : " + JSON.stringify(items.global.interests));
                }
            }
        }
        console.log(JSON.stringify(scores));
    });
}
// console.log("Chal gya");
if (urlcheck(document.location.href) <= 0.1) {
    // checkInterest();
    try {
        BlockURL();
    } catch (err) {
        //console.log(err);
    }
} else {
    // //console.log('else');
    // //console.log(chrome.extension.getURL("/html/safetypage"));
    chrome.runtime.sendMessage({
        type: "redirect",
        redirect: chrome.extension.getURL("/html/safetypage.html")
    });
}
// chrome.storage.local.get('info', function(things) {
//     //console.log("here is the thing bro : " + JSON.stringify(things));
// });
var prevURL = "";

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
            if (urlcheck(prevURL) > 0.1) {
                chrome.runtime.sendMessage({
                    type: "redirect",
                    redirect: chrome.extension.getURL("/html/safetypage.html")
                });
            }
        }
    }
}
try {
    new MutationObserver(observer).observe(document.body, {
        subtree: true,
        childList: true
    });

} catch (e) {
    ////console.log("Some error in MutationObserver");
}
