var data = require('../data/typechecker.js');

export {
    checkType
};

var categories = data.categories;

function checkType() {
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
            // //console.log(u);
            var parsed = JSON.parse(JSON.stringify(tempBannedURLs[u]));
            var tempURL2 = parsed.url;
            //console.log(tempURL2);
            if (tempURL2) {
                if (tempURL2.split(" ").length > 1) {
                    var tempURL = tempURL2.split(" ")[0];
                    //console.log('temp url is' + tempURL);
                    var time1 = new Date(parsed.time.toString());
                    var time2 = new Date();
                    var time = new Date(time1.getTime() + time1.getTimezoneOffset() * 60000);
                    var curr_time = new Date(time2.getTime() + time2.getTimezoneOffset() * 60000);
                    // ////console.log(curr_time + time + "time123123");
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
        //console.log(JSON.stringify(bannedSet));
        for (var i = 0; i < metaTags.length; i++) {
            if (metaTags[i].getAttribute("name")) {
                if (metaTags[i].getAttribute("name").toLowerCase() == "keywords" || metaTags[i].getAttribute("name").toLowerCase() == "description") {
                    ////console.log(metaTags[i].getAttribute("content"));
                    var vals = metaTags[i].getAttribute("content").toString().replace(",", " ").replace(".", " ").replace("-", " ");
                    // //console.log(vals);
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
                                    // //console.log('banned bro' + name + "   " + subcat);
                                    disabled = true;
                                }
                                // //console.log(subcat);
                                var reg = new RegExp(".*" + "\\b" + subcat + "\\b" + ".*", "gi");
                                // //console.log(reg);
                                // //console.log(vals.match(reg));
                                if (vals.match(reg)) {
                                    // //console.log('Strong Match');
                                    // //console.log("Cat is " + cat + ", Subcat is " + subcat);
                                    scores[name] += 2;
                                    strong = true;
                                } else {
                                    // //console.log("not " + subcat);
                                }
                            }
                            if (strong) {
                                if (disabled) {
                                    //console.log("banned 123 " + name);
                                    chrome.runtime.sendMessage({
                                        type: "redirect",
                                        redirect: chrome.extension.getURL("/html/safetypage.html")
                                    });
                                    return;
                                }
                                for (var j in sub_weak) {
                                    // ////console.log(subs[j] + " is " + vals.indexOf(subs[j]));
                                    var subcat = sub_weak[j].toLowerCase();
                                    // //console.log(subcat);
                                    var reg = new RegExp(".*" + "\\b" + subcat + "\\b" + ".*", "gi");
                                    // //console.log(reg);
                                    // //console.log(vals.match(reg));
                                    if (vals.match(reg)) {
                                        scores[name] += 1;
                                        // //console.log('Weak Match');
                                        // //console.log("Cat is " + cat + ", Subcat is " + subcat);
                                    } else {
                                        // //console.log("not " + subcat);
                                    }
                                }
                            }
                        }
                    }
                    ////console.log("Final interest is : " + JSON.stringify(items.global.interests));
                }
            }
        }
        //console.log(JSON.stringify(scores));
    });
}