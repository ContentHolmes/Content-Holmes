var data = require('./modules/data/URLBlocker.js');
var urlobserver = require('./modules/observer/urlobserver.js');
var search = require('./modules/urlblock/searchanalyzer.js');
var banned = require('./modules/urlblock/bannedmanager.js');
var trusted = require('./modules/urlblock/trustedmanager.js');
var typecheck = require('./modules/urlblock/typechecker.js');
var cognitiveServicesKey="82535cdc5d3849cea09575b48b3b1e98";
var no_of_checks = 0;


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
var learningURLCalls;
var maxLearningURLCalls;
chrome.storage.local.get(['global'],function(items){
  learningURLCalls=items.global.learningURLCalls;
  maxLearningURLCalls=items.global.maxLearningURLCalls;
  //cognitiveServicesKey=items.global.cognitiveServicesKey;
});
console.log("msft key from blocker:"+cognitiveServicesKey);
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
          1. Get the settings and global elements from	 chrome local storage
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
    // console.log('url string' + urlString);
    if(!urlString) {
    	document.getElementsByTagName('body')[0].style.visibility = 'visible';
    	return;
    }
    trusted.checkPresenceInTrusted(urlString).then(val => {
        if(val == true){
            document.getElementsByTagName('body')[0].style.visibility = 'visible';
            return;
        }else{
            checkNudeImages();
        }
    }, err => {
        console.log(err);
    });
}

function getName(str) {
    const regex = /\/\/w{0,3}\.?(.*)\.\w{1,4}\/.*/gi;
    str = str + "/";
    var name = regex.exec(str);
    //console.log('regex');
    ////console.log(name[1]);
    try {
        return name[1];
    } catch (err) {
    	return null;
    }
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
    var checkImg = new Promise(function(resolve, reject){
        console.log('starting image check');
        console.log('images array is ');
        for (var k = 0; k < imagesArray.length; k++){
            try {
                var url = getImageName(imagesArray[k].src);
                console.log(url);
                checkImagePresence(imagesArray[k], url);
            } catch (err) {
                console.log("error in images");
            }
            console.log(imagesArray[k].src);
        }
        resolve('done');
    });
    checkImg.then(() => {
        console.log('done image check');
        if(checkCount == 0){
            document.getElementsByTagName('body')[0].style.visibility = 'visible';
        }
    });
    // //console.log('check count2' + checkCount);
}

function checkImagePresence(image, url){
    banned.checkPresenceInBanned(url).then(val => {
        if(val == true){
            console.log('in banned');
            globalBadCount++;
            image.style.visibility = "hidden";
        }else{
            console.log('not in banned');
            trusted.checkPresenceInTrusted(url).then(val => {
                if(val == false){
                    console.log('not in trusted');
                    if ((image.clientWidth > 300 || image.clientHeight > 300) && checkCount < 10 && learningURLCalls <= maxLearningURLCalls) {
                        //send image for adult content to be checked
                        console.log('sending image' + url);
                        NudeCheck(image);
                        checkCount++;
                        learningURLCalls++;
                        console.log("Learning URL calls="+learningURLCalls);
                        chrome.storage.local.get(['global'],function(items){
                          var globalThingy=items.global;
                          globalThingy.learningURLCalls=learningURLCalls;
                          chrome.storage.local.set({
                            global:globalThingy
                          });
                        });
                    }
                }
            }, err => {
                console.log(err);
            });
        }
    }, err => {
        console.log('bad image check url' + url);
        console.log(err);
    });
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
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", cognitiveServicesKey);
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
        chrome.runtime.sendMessage({
            type: "addBlockedURLToServer",
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

        banned.add(getImageName(image.src));

        // //console.log('going to safetypage');
        chrome.runtime.sendMessage({
            type: "redirect",
            redirect: chrome.extension.getURL("/html/safetypage.html")
        });
    } else if (globalGoodCount == 10) {
        trusted.add(getImageName(image.src));
    }
    no_of_checks++;
    // //console.log('check count' + checkCount);
    if (no_of_checks == checkCount) {
        // //console.log("end here");
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
    }
}

if (search.urlcheck(document.location.href) <= 0.1) {
    typecheck.checkType();
    try {
        BlockURL();
    } catch (err) {
    }
} else {
    chrome.runtime.sendMessage({
        type: "redirect",
        redirect: chrome.extension.getURL("/html/safetypage.html")
    });
}

urlobserver();
urlobserver.addCallback(function(prevURL) {
    if (search.urlcheck(prevURL) > 0.1) {
        chrome.runtime.sendMessage({
            type: "redirect",
            redirect: chrome.extension.getURL("/html/safetypage.html")
        });
    }
});
urlobserver.addCallback(function(prevURL) {
    typecheck.checkType();
});
