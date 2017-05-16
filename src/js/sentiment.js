var nlp = require('./modules/nlp/nlp.js');
var dictionary = require('./modules/nlp/dictionary.js');
var data = require('./modules/data/data.js')

var offensivewords = data.offensivewords;

var words = data.words;

var negs = data.negs;

var boosters = data.boosters;

var email = "";
var password = "";
var isInfoAvailable = false;
var offensiveSum = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    try {
        if (request.message == "FireSentiment") {
            startSentiment();
            sendResponse({
                message: "we're cool"
            });
        }
    } catch (err) {
        ////console.log(err);
    }
});

function startSentiment() {
    // Gets all the text nodes and checks the text to calculate the sentiment score.
    var iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
    var depressionmin = 0;
    offensiveSum = 0;
    var depressionCalc, node;
    while ((node = iterator.nextNode())) {
        depressionCalc = parseParagraphs(node);
        if (depressionCalc < depressionmin) {
            depressionmin = depressionCalc;
        }
    }
    // console.log("From minimum depression: " + depressionmin);
    try{
        lessThanPrevious(depressionmin);
    }catch(e){
        //
    }
    return;
}

function lessThanPrevious(score) {
    /*
      new=false ;
      get The sentiments array from global chrome storage.
      If empty:
        simply insert
        new = true;
      else :
        if newDate than previous stored thing, then
          if length in array==7
            sentiments.shift()
            insert a new Element();
          else
            insert a newElement();
        new=true;
        else{
            if array.lastElement().value > score:
              array.lastElemet()=new Element;
              new=true;
        }
    */
    /*
      object type to store in sentiments array:
      {
        "Date":new Date();
        "value":int;
      }
    */
    var arr = [];
    var globaling = {};
    var newThing = false;
    chrome.storage.local.get(['settings', 'global'], function(items) {
        arr = items.global.sentimentThings;
        globaling = items.global;
        ////console.log("Logging sentiment things : " + JSON.stringify(arr[arr.length - 1]));
        var newObj = {
            "Date": (new Date()).toString(),
            "value": score
        };
        // ////console.log("newObj is " + JSON.stringify(newObj));
        if (!arr) {
            arr = [];
            arr.push(newObj);
            // ////console.log('no arr' + JSON.stringify(arr[0]));
            newThing = true;
        } else if (arr.length == 0) {
            arr.push(newObj);
            // ////console.log('length = 0' + JSON.stringify(arr[0]));
            newThing = true;
        } else {
            var d = new Date();
            var dateval = new Date(arr[arr.length - 1].Date);
            // ////console.log(dateval + "  date   " + d);
            if ((d.getDay() != dateval.getDay())) {
                if (arr.length == 7) {
                    arr.shift();
                    arr.push(newObj);
                } else {
                    arr.push(newObj);
                }
                newThing = true;
            } else {
                if (arr[arr.length - 1].value > score) {
                    // console.log("scroe is " + score);
                    arr[arr.length - 1] = newObj;
                    newThing = true;
                }
            }
        }
        if (newThing == true) {
            // globaling.sentimentThings=arr;
            items.global.sentimentThings = arr;
            chrome.storage.local.set({
                global: items.global
            });
            // ////console.log("Final global array : " + JSON.stringify(arr));
            sendData(score);
        }
    });
}

function sendData(depressionmin) {
    ////console.log("I am inside hrer bros");
    chrome.runtime.sendMessage({
        type: "depressionReport",
        score: depressionmin
    });
    // chrome.storage.local.get('info', function(things) {
    //     var newObj;
    //     if (!things.info) {
    //         newObj = {
    //             "type": "depressionScores",
    //             "email": "default",
    //             "password": "default",
    //             "childName": "default",
    //             "time": new Date(),
    //             "value": depressionmin
    //         };
    //     } else {
    //         isInfoAvailable = true;
    //         newObj = {
    //             "type": "depressionScores",
    //             "email": things.info.email,
    //             "password": things.info.password,
    //             "childName": things.info.childName,
    //             "time": new Date(),
    //             "value": depressionmin
    //         };
    //     }
    //     if (isInfoAvailable) {
    //         $.ajax({
    //                 url: "https://www.contentholmes.com/childReport",
    //                 beforeSend: function(xhrObj) {
    //                     // Request headers
    //                     xhrObj.setRequestHeader("Content-Type", "application/json");
    //                 },
    //
    //                 type: "POST",
    //                 data: JSON.stringify(newObj),
    //                 // Request body
    //             })
    //             .done(function(data) {
    //                 ////console.log("succcesssful req: " + data);
    //             })
    //             .fail(function() {
    //                 ////console.log("error");
    //             });
    //     }
    // });
}

function parseParagraphs(node) {
    var ignoreThese = {
        "STYLE": 0,
        "NOSCRIPT": 0,
        "SCRIPT": 0
    };
    if (node.parentElement.tagName in ignoreThese) {
        return 0;
    }
    //////console.log("STARTING WITH A NEW TEXT NODE:\n"+node.nodeValue.toString());
    var str = node.nodeValue.toString();
    //var str="I am not happy";
    var sentenceArray = getSentences(str);
    var totalWords = 0;
    var sum = 0;
    for (var i in sentenceArray) {

        var newSentence = nlp.wordextract(sentenceArray[i].toString());
        formatWordsInArray(newSentence);
        totalWords = totalWords + newSentence.length;
        // console.log(newSentence);
        var newSum = calculateSum(newSentence);
        //////console.log("THE SUM FOR THE SENTENCE:\n"+sentenceArray[i]+"\nis :"+newSum);
        sum = sum + newSum /**newSentence.length*/ ;

    }
    var depressionCalc = sum /*/totalWords*/ ;
    if (depressionCalc || depressionCalc == 0) {
        //////console.log("THE SUM/TOTALLENGTH BECOMES:"+depressionCalc);
    }
    return depressionCalc;
}

function formatWordsInArray(wordsArray) {
    for (var i in wordsArray) {
        wordsArray[i] = wordsArray[i].toString().toLowerCase().replace(/[^a-z]/gi, '');
    }
}

function calculateSum(wordsArray) {
    var sum = 0;
    var negation = false;
    for (var i in wordsArray) {
        if (offensiveSum >= 10) {
            // console.log("offensive words");
            chrome.runtime.sendMessage({
                type: "redirect",
                redirect: chrome.extension.getURL("/html/safetypage.html")
            });
        }
        var newWord = wordsArray[i];
        var found = false;
        if (offensivewords.indexOf(newWord) != -1) {
            offensiveSum += 1;
            // console.log("word is  " + newWord);
        }

        if (words.hasOwnProperty(newWord)) {
            sum += words[newWord];
            found = true;
        }
        // check for booster array
        if (boosters.hasOwnProperty(newWord)) {
            sum += boosters[newWord];
            found = true;
            //////console.log("new Words : "+newWord);
        }
        // there is a limitation to it. Two false won't make a true
        if (negs.hasOwnProperty(newWord)) {
            if (!negation) {
                negation = true;
            } else {
                negation = false;
            }
            found = true;
        }
        if(!found) {	//Learning codes here. Can be tagged by postagger and put it in appropriate arrays!
        	// dictionary(newWord, function(data) {
        	// 	console.log(JSON.stringify(data));
        	// });
        }
    }
    if (negation == true) {
        sum = (-1) * sum;
    }
    return sum;
}

function getSentences(str) {
    const regex = /(\.\s)?([A-Z][^\.!\?]+[\.!\?])/g;
    var sentences = [];
    str = str + ".";
    var m;

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        sentences.push(m[0]);
    }
    return sentences;
}
try {
    new MutationObserver(startSentiment).observe(document.body, {
        subtree: true,
        childList: true
    });
} catch (e) {

    ////console.log("Some error in MutationObserver");
}
