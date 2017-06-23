var currentVersion = '2.0.10';
var id = "lcandgkmchopkmfanmeoemmgncdkdcij";
var banned = require('./modules/urlblock/bannedmanager.js');

chrome.storage.local.get(['settings', 'global'], function(items) {
    var global = items.global || {};

    if (global.version != currentVersion) {
        // Update version
        global.version = currentVersion;
        // Update some variables to their default value
        global.enabled = true;
        // set it as object {"date":"","URL":""}
        global.showChangelog = true;
    }
    global.tempBlockedURLs = global.tempBlockedURLs || [{
        URL: "facebook",
        time: "Sat Feb 18 2017 17:42:50 GMT+0000 (GMT)"
    }];
    global.timeoutExpired = global.timeoutExpired || false;
    global.id = global.id || id;
    global.sessionTime = global.sessionTime || 0;
    global.sessionStarted = global.sessionStarted || false;
    global.allBlocked = global.allBlocked || false;
    global.dateBlocked = global.dateBlocked || 0;
    global.initalInterval = global.initalInterval || 0;
    global.updatedTime = global.updatedTime || new Date();
    global.historyOfBlockedURLS = global.historyOfBlockedURLS || [];
    global.bannedURLs = global.bannedURLs || "{}";
    global.bannedURLObj = global.bannedURLObj || {};
    global.trustedURLs = global.trustedURLs || "{}";
    global.trustedURLObj = global.trustedURLObj || {};
    global.email = global.email || "";
    global.password = global.password || "";
    global.interestBuffer = global.interestBuffer || {};
    global.interests = global.interests || [];
    global.sentimentThings = global.sentimentThings || [];
    global.cognitiveServicesKey = global.cognitiveServicesKey || "";

    global.learningURLCalls=0;
    global.maxLearningURLCalls=30;

    global.learningWordsCalls=0;
    global.maxLearningWordsCalls=25;
    global.learntWords={"yo":0};

    chrome.storage.local.set({
        global: global
    });
});

var prev = true;
var email, password, childName, dataAvailable = false;
var changedTime = "",
    changedInterval = 0,
    blocked = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == "sentiment") {
        //console.log("sentiment will be fired");
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: "FireSentiment"
            }, function(response) {
                // //console.log(response.message);
            });
        });
        //console.log("this function ran");
        sendResponse({
            message: "good luck bro"
        });
    } else if (request.type == "redirect") {
        console.log("I am here");
        try {
            chrome.tabs.update(sender.tab.id, {
                url: request.redirect
            });
        } catch (err) {
            chrome.tabs.update(sender.tab.id, {
                url: request.redirect
            });
        }
    } else if (request.type == "sendReport") {
        // Sends a report if child lands on restricted site
        // console.log('send report' + sender.tab.id);
        // sendResponse({tabId:sender.tab.id});
        if (!dataAvailable) {
            // console.log('what');
            conn();
        } else {
            var sendObj = {
                type: "URL",
                email: email,
                password: password,
                childName: childName,
                time: new Date(),
                value: request.url
            };
            // console.log('sending child report');
            $.ajax({
                    url: "https://www.contentholmes.com/childReport",
                    beforeSend: function(XhrObj) {
                        XhrObj.setRequestHeader("Content-Type", "application/json");
                    },
                    type: "POST",
                    data: JSON.stringify(sendObj)
                })
                .done(function(data) {
                    // console.log("data sent to server");
                    sendResponse({
                        message: "shoot"
                    });
                })
                .fail(function() {
                    console.log("error in server upload");
                });
        }
    } else if (request.type == "depressionReport") {
        if (!dataAvailable) {
            // console.log('what');
            conn();
        } else {
            var sendObj = {
                type: "depressionScores",
                email: email,
                password: password,
                childName: childName,
                time: new Date(),
                value: request.score
            };
            // console.log('sending child report');
            // console.log(JSON.stringify(sendObj));
            $.ajax({
                    url: "https://www.contentholmes.com/childReport",
                    beforeSend: function(XhrObj) {
                        XhrObj.setRequestHeader("Content-Type", "application/json");
                    },
                    type: "POST",
                    data: JSON.stringify(sendObj)
                })
                .done(function(data) {
                    // console.log("data sent to server");
                    sendResponse({
                        message: "shoot"
                    });
                })
                .fail(function() {
                    console.log("error in server upload");
                });
        }
    } else if (request.type == "messaging") {
        chrome.runtime.sendMessage(id, {
                url: "https://www.contentholmes.com/appDisabled",
                post: {
                    email: request.email,
                    childName: request.childName
                }
            },
            function(response) {});
    } else if (request.type == "sendInterests") {
        console.log("I am here 1231123123");
        var interests = request.interests;
        console.log(JSON.parse(interests));
        if (!dataAvailable) {
            // console.log('what');
            conn();
        } else {
            var sendObj = {
                email: email,
                password: password,
                childName: childName,
                interests: interests
            };
            console.log(JSON.stringify(sendObj));
            console.log('sending child report');
            // console.log(JSON.stringify(sendObj));
            $.ajax({
                    url: "https://www.contentholmes.com/addinterests",
                    beforeSend: function(XhrObj) {
                        XhrObj.setRequestHeader("Content-Type", "application/json");
                    },
                    type: "POST",
                    data: JSON.stringify(sendObj)
                })
                .done(function(data) {
                    // console.log("data sent to server");
                    console.log("yo its done yoyoyoyo");
                })
                .fail(function() {
                    console.log("error in server upload");
                });
        }
    }

});

chrome.storage.local.get(['settings', 'global'], function(items) {
    var date = new Date();
    // console.log(items.global.updatedTime);
    var date2;
    if (items.global) {
        date2 = new Date(items.global.updatedTime);
    } else {
        date2 = new Date();
    }
    // console.log(date2.getDate() + "   " + date.getDate());
    if (date2.getDate() != date.getDate()) {
        items.global.allBlocked = false;
        items.global.timeoutExpired = false;
        //console.log('reset date' + date.getDate());
    }
    // if (items.global.interestpushdate == "") {
    //     items.global.interestpushdate = date;
    //     //push date
    // } else {
    //     var date2 = new Date(items.global.interestpushdate);
    //     if (date.getTime() - date2.getTime() > 604800000) {
    //         items.global.interestpushdate = date;
    //         //push
    //     }
    // }
    chrome.storage.local.set({
        global: items.global
    });
});

// chrome.storage.local.get('info', function(item) {
//     //console.log(item.info);
//     if (!item.info) {
//         //console.log('you r here');
//         dataAvailable = false;
//         chrome.tabs.create({
//             url: chrome.extension.getURL("/html/first.html")
//         });
//         // chrome.runtime.sendMessage({
//         //     redirect: chrome.extension.getURL("/html/first.html")
//         // });
//     }
// });

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.storage.local.get('info', function(item) {
        // //console.log(item.info);
        if (!item.info) {
            dataAvailable = false;
            chrome.tabs.create({
                url: chrome.extension.getURL("/html/first.html")
            });
            // chrome.runtime.sendMessage({
            //     redirect: chrome.extension.getURL("/html/first.html")
            // });
        }
    });
});
chrome.management.onDisabled.addListener(function(details) {
    var email, childName;
    if (details.id == id) {
        chrome.storage.local.get('info', function(item) {
            if (!item.info) {
                chrome.runtime.sendMessage({
                    type: "redirect",
                    redirect: chrome.extension.getURL("/html/first.html")
                });
            } else {
                console.log("disable attempt!");
                email = item.info.email;
                childName = item.info.childName;
                //console.log("Complementary extension was disabled 2 was disabled");
                var sendObj = {
                    "email": email,
                    "childName": childName
                };
                $.ajax({
                        url: "https://www.contentholmes.com/appDisabled",
                        beforeSend: function(xhrObj) {
                            xhrObj.setRequestHeader("Content-Type", "application/json");
                        },
                        type: "POST",
                        data: JSON.stringify(sendObj),
                    })
                    .done(function(data) {
                        console.log("sent!");
                    })
                    .fail(function() {
                        console.log("disabled get route request failed");
                    });
            }
        });
    }

});
chrome.management.onInstalled.addListener(function(details) {
    if (details.id != id) {
        return;
    }
    chrome.storage.local.get('info', function(item) {
        if (!item.info) {
            chrome.runtime.sendMessage({
                type: "redirect",
                redirect: chrome.extension.getURL("/html/first.html")
            });
        } else {
            email = item.info.email;
            childName = item.info.childName;
            chrome.runtime.sendMessage(id, {
                    url: "https://www.contentholmes.com/appDisabled",
                    post: {
                        email: email,
                        childName: childName
                    }
                },
                function(response) {});
        }
    });
});

var conn = function() {
  console.log("function fired");
    chrome.storage.local.get('info', function(item) {
        // //console.log(item.info);
        if (!item.info) {
            // chrome.runtime.sendMessage({
            //     redirect: chrome.extension.getURL("/html/first.html")
            // });
            //console.log('empty');
        } else {
            dataAvailable = true;
            // console.log('connect');
            email = item.info.email;
            childName = item.info.childName;
            password = item.info.password;
            sockconn();
            clearInterval(conn);
        }
    });
}
conn();
//getKeyValue();
setInterval(conn, 300000);

function getKeyValue(){
  $.ajax({
      url: "https://www.contentholmes.com/getKeyValue",
      beforeSend: function(xhrObj) {
          xhrObj.setRequestHeader("Content-Type", "application/json");
      },
      type: "GET"
  })
  .done(function(data) {
      var parsed=JSON.parse(data);
      console.log("received! key="+parsed.key);
      chrome.storage.local.get(['global'],function(items){
        items.global.cognitiveServicesKey=parsed.key;
        chrome.storage.local.set({
          global:items.global
        });
      });
  })
  .fail(function() {
      console.log("getKeyValue request failed");
  });

}
function sockconn() {
    var socket = io("https://www.contentholmes.com");
    socket.on('connect', function(data) {
        // console.log('yo im connected');
        socket.emit('newUser', JSON.stringify({
            'email': email,
            'password': password,
            'childName': childName
        }));
        //console.log('connected');
    });
    // socket.on('thisisit', function(data) {
    //     //console.log('this ' + data);
    // });

    socket.on(email + '_' + childName + '_blockedURLs',
        function(data) {
            var parsed = JSON.parse(data);
            // //console.log(data);
            if (parsed.success == true) {
                chrome.storage.local.get(['settings', 'global'], function(items) {
                    console.log('tempURLArray' + JSON.stringify(parsed.URLArray));
                    items.global.tempBlockedURLs = (parsed.URLArray).urls;
                    // //console.log(JSON.stringify(items.global.tempBlockedURLs));
                    chrome.storage.local.set({
                        global: items.global
                    });
                });
            }
        });
    socket.on(email + '_' + childName + '_serverBlockedArray',function(data){
      var arr=JSON.parse(data);
      for(var i=0;i<arr.length;i++){
        if(arr[i]){
          banned.add(arr[i]);
          console.log("new bocker URL value: "+arr[i]);
        }
      }
      //console.log("new blocked URLS data :"+JSON.stringify(data));
    });
    socket.on(email + '_' + childName + '_session',
        function(data) {
            var parse2 = JSON.parse(data);
            // //console.log('data is session ' + data);
            if (parse2.success == true) {
                chrome.storage.local.get(['settings', 'global'], function(items) {
                    var parsed = parse2.session;
                    // //console.log(JSON.stringify(parsed));
                    changedTime = parsed.lastUpdated;
                    changedInterval = parsed.sessionTime;
                    blocked = parsed.isUpdated;
                    //console.log('blocked ' + blocked + items.global.allBlocked);
                    if (items.global.sessionStarted == true) {
                        //check for changes
                        if (!blocked) {
                            items.global.sessionStarted = false;
                            items.global.allBlocked = false;
                            items.global.timeoutExpired = true;
                        } else {
                            if (items.global.updatedTime != changedTime) {
                                items.global.sessionTime = changedInterval;
                                items.global.initialInterval = changedInterval;
                                items.global.updatedTime = changedTime;
                            }
                            if (items.global.sessionTime == 0) {
                                items.global.sessionStarted = false;
                                items.global.allBlocked = true;
                                items.global.timeoutExpired = true;
                                //console.log("Session Over");
                            } else
                                items.global.sessionTime -= 1;
                            //console.log('session time' + items.global.sessionTime);
                        }
                        chrome.storage.local.set({
                            global: items.global
                        });
                    } else {
                        // //console.log('set timeout' + items.global.sessionTime);
                        // //console.log("timeout over" + items.global.timeoutExpired);
                        // //console.log("updated time" + items.global.updatedTime);
                        if (items.global.timeoutExpired) {
                            if (changedTime != items.global.updatedTime) {
                                //console.log("expired");
                                if (blocked) {
                                    //console.log("not blocked");
                                    items.global.updatedTime = changedTime;
                                    items.global.sessionStarted = true;
                                    items.global.sessionTime = changedInterval;
                                    items.global.timeoutExpired = false;
                                    items.global.allBlocked = false;
                                    //console.log('new expired' + changedInterval);
                                } else {
                                    items.global.allBlocked = false;
                                }
                                // //console.log("Interval started ");
                            }
                            //check for new timeouts
                        } else if (changedTime != items.global.updatedTime) {
                            //console.log("start");
                            // //console.log('start');
                            // //console.log(blocked == true);
                            if (blocked) {
                                //console.log("start with new time" + changedTime + items.global.updatedTime.toString());
                                items.global.updatedTime = changedTime;
                                items.global.allBlocked = false;
                                items.global.sessionStarted = true;
                                items.global.sessionTime = changedInterval;
                                //console.log("Interval is : " + changedInterval + " @ " + changedTime);
                            }
                        }
                        //console.log('blocked is 123' + items.global.allBlocked);
                        //set initial timer
                        chrome.storage.local.set({
                            global: items.global
                        });
                    }
                });
            }
        });
}

function runInterval() {
    chrome.storage.local.get(['settings', 'global'], function(items) {
        //console.log("final " + items.global.allBlocked)
        if (items.global.sessionStarted) {
            if (items.global.sessionTime <= 0) {
                items.global.sessionStarted = false;
                items.global.allBlocked = true;
                items.global.timeoutExpired = true;
                items.global.sessionTime = 0;
                //console.log("Session Over");
            } else
                items.global.sessionTime -= 1;
        }
        chrome.storage.local.set({
            global: items.global
        });
        //console.log('session time is 123   ' + items.global.sessionTime + items.global.allBlocked);
    });
    // chrome.extension.isAllowedIncognitoAccess(function(access) {
    //     // //console.log(access);
    //     if (!access) {
    //         if (prev) {
    //             // //console.log(prev);
    //             if (dataAvailable) {
    //                 prev = false;
    //                 var sendobj = {
    //                     email: email,
    //                     password: password,
    //                     notification: "Extension not enabled on incognito for " + childName
    //                 }
    //                 $.ajax({
    //                         url: "https://www.contentholmes.com/notification",
    //                         beforeSend: function(XhrObj) {
    //                             XhrObj.setRequestHeader("Content-Type", "application/json");
    //                         },
    //                         type: "POST",
    //                         data: JSON.stringify(sendobj)
    //                         // Request body
    //                     })
    //                     .done(function(data) {
    //                         //console.log('request sent ' + data);
    //                         // //console.log("data sent to server");
    //                     })
    //                     .fail(function() {
    //                         //console.log('request fail');
    //                         // //console.log("error in request to server");
    //                     });
    //             }
    //         }
    //     } else {
    //         prev = true;
    //     }
    // });
}
setInterval(runInterval, 6000);
// sockconn();
// function intervalStuff() {
//     //console.log("background check");
//     chrome.storage.local.get(['settings', 'global'], function(items) {
//         // var email = "mrigesh";
//         // var password = "mrigesh";
//         // var childName = "Rajat";
//         // if(!(chrome.storage.local.get('info'))){
//         // chrome.runtime.sendMessage({
//         //     redirect: chrome.extension.getURL("/html/first.html")
//         // });
//         // }
//
//         chrome.storage.local.get('info', function(item) {
//             //console.log(item.info);
//             if (!item.info) {
//                 //console.log('you r here');
//                 dataAvailable = false;
//                 // chrome.runtime.sendMessage({
//                 //     redirect: chrome.extension.getURL("/html/first.html")
//                 // });
//             } else {
//                 dataAvailable = true;
//                 email = item.info.email;
//                 password = item.info.password;
//                 childName = item.info.childName;
//             }
//         });
//         if (dataAvailable) {
//             // var changedTime = (new Date("Sat Feb 19 2017 09:52:50 GMT+0000 (GMT)")).toString();
//             //console.log("changed time : " + changedTime);
//             // var changedInterval = 5;
//             // var blocked = false;
//             var url = "https://www.contentholmes.com/getBlockedURLs/?email=" + email + "&password=" + password + "&childName=" + childName;
//             // //console.log("url is " + url);
//             $.ajax({
//                     url: "https://www.contentholmes.com/getBlockedURLs/?email=" + email + "&password=" + password + "&childName=" + childName,
//                     type: "GET"
//                     // Request body
//                 })
//                 .done(function(data) {
//                     //console.log('username' + email);
//                     //console.log("data got broooooo url block");
//                     // //console.log(JSON.stringify(data));
//                     var parsed = JSON.parse(JSON.stringify(data));
//                     if (parsed.success == true) {
//                         items.global.tempBlockedURLs = parsed.URLArray;
//                         //console.log(JSON.stringify(items.global.tempBlockedURLs));
//                         chrome.storage.local.set({
//                             global: items.global
//                         });
//                     }
//                 })
//                 .fail(function() {
//                     //console.log("error pa ap ap ap ap a");
//                 });
//             $.ajax({
//                     url: "https://www.contentholmes.com/getsession/?email=" + email + "&password=" + password + "&childName=" + childName,
//                     type: "GET"
//                     // Request body
//                 })
//                 .done(function(data) {
//                     //console.log("data got broooooo session");
//                     //console.log(JSON.stringify(data));
//                     var parse2 = JSON.parse(JSON.stringify(data));
//                     if (parse2.success == true) {
//                         var parsed = JSON.parse(JSON.stringify(parse2.session));
//                         // //console.log(JSON.stringify(parsed));
//                         changedTime = parsed.lastUpdated;
//                         changedInterval = parsed.sessionTime;
//                         blocked = parsed.isUpdated;
//                         //console.log(blocked);
//                     }
//                 })
//                 .fail(function() {
//                     //console.log("error pa ap ap ap ap a");
//                 });
//             //console.log("session " + items.global.sessionStarted);
//             if (items.global.sessionStarted == true) {
//                 //check for changes
//                 if (!blocked) {
//                     items.global.sessionStarted = false;
//                     items.global.allBlocked = false;
//                     items.global.timeoutExpired = true;
//                 } else {
//                     if (items.global.updatedTime != changedTime) {
//                         items.global.sessionTime = changedInterval;
//                         items.global.initialInterval = changedInterval;
//                         items.global.updatedTime = changedTime;
//                     }
//                     if (items.global.sessionTime == 0) {
//                         items.global.sessionStarted = false;
//                         items.global.allBlocked = true;
//                         items.global.timeoutExpired = true;
//                         //console.log("Session Over");
//                     } else
//                         items.global.sessionTime -= 1;
//                     //console.log(items.global.sessionTime);
//                 }
//                 chrome.storage.local.set({
//                     global: items.global
//                 });
//             } else {
//                 // //console.log('set timeout' + items.global.sessionTime);
//                 // //console.log("timeout over" + items.global.timeoutExpired);
//                 // //console.log("updated time" + items.global.updatedTime);
//                 if (items.global.timeoutExpired) {
//                     if (changedTime != items.global.updatedTime) {
//                         //console.log("expired");
//                         if (blocked) {
//                             //console.log("not blocked");
//                             changedTime = items.global.updatedTime;
//                             items.global.timeoutExpired = false;
//                             items.global.allBlocked = false;
//                         } else {
//                             items.global.allBlocked = false;
//                         }
//                         // //console.log("Interval started ");
//                     }
//                     //check for new timeouts
//                 } else if (changedTime != items.global.updatedTime) {
//                     //console.log("start");
//                     // //console.log('start');
//                     // //console.log(blocked == true);
//                     if (blocked) {
//                         //console.log("start with new time" + changedTime + items.global.updatedTime.toString());
//                         items.global.updatedTime = changedTime;
//                         items.global.allBlocked = false;
//                         items.global.sessionStarted = true;
//                         items.global.sessionTime = changedInterval;
//                         //console.log("Interval is : " + changedInterval + " @ " + changedTime);
//                     }
//                 }
//                 //set initial timer
//                 chrome.storage.local.set({
//                     global: items.global
//                 });
//             }
//         }
//     });
// }
// intervalStuff();
// var sessionTimer = setInterval(intervalStuff, 36000000);
