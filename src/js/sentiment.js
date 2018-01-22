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
var offensiveSum = 0; // This variable keeps track of the number of offensive words on the web page being viewwed.
var wordsLearnCalls=0; // This variable is to limit the number of calls to the oxford api for leaning new words.

var globalWordsLearnCalls;
var maxGlobalWordsLearnCalls;
var learntWords;

chrome.storage.local.get(['global'], function(items) {

    globalWordsLearnCalls=items.global.learningWordsCalls;
    maxGlobalWordsLearnCalls=items.global.maxLearningWordsCalls;
    learntWords=items.global.learntWords;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    try {
        if (request.message == "FireSentiment") {
            startSentiment();
            sendResponse({
                message: "we're cool"
            });
        }
    } catch (err) {
        // console.log(err);
    }
});

function startSentiment() {
    // Gets all the text nodes from the DOM and checks the text to calculate the sentiment score.
    var iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
    var depressionmin = 0; // this variable stores the minimum sentiment scores of all the text nodes.
    offensiveSum = 0; 
    var depressionCalc, node;
    while ((node = iterator.nextNode())) {
        depressionCalc = parseParagraphs(node);
        if (depressionCalc < depressionmin) {
            depressionmin = depressionCalc;
        }
    }
    // console.log("Minimum depression score: " + depressionmin);
    try{
        lessThanPrevious(depressionmin);
    }catch(e){
        //
    }
    return;
}

function lessThanPrevious(score) {
    /* Determines if the newly calculated sentiment score for the day is less than the score stored already.
       If yes, this score is stored as the day's minimum.
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
        var newObj = {
            "Date": (new Date()).toString(),
            "value": score
        };
        if (!arr) {
            arr = [];
            arr.push(newObj);
            newThing = true;
        } else if (arr.length == 0) {
            arr.push(newObj);
            newThing = true;
        } else {
            var d = new Date();
            var dateval = new Date(arr[arr.length - 1].Date);
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
            sendData(score);
        }
    });
}

function sendData(depressionmin) {
    // sends the data to background script (event.js)
    chrome.runtime.sendMessage({
        type: "depressionReport",
        score: depressionmin
    });
}
function parseParagraphs(node) {
    // Takes a text node and converts all the text into an array of words and calculates the sentiment score of the array.
    var ignoreThese = {
        "STYLE": 0,
        "NOSCRIPT": 0,
        "SCRIPT": 0
    };
    if (node.parentElement.tagName in ignoreThese) {
        return 0;
    }
    var str = node.nodeValue.toString();
    //var str="I am not happy";
    var sentenceArray = getSentences(str);
    var totalWords = 0;
    var sum = 0;
    for (var i in sentenceArray) {

        var newSentence = nlp.wordextract(sentenceArray[i].toString());
        formatWordsInArray(newSentence);
        totalWords = totalWords + newSentence.length;
        var newSum = calculateSum(newSentence);
        sum = sum + newSum /**newSentence.length*/ ;
    }
    var depressionCalc = sum /*/totalWords*/ ;
    return depressionCalc;
}

function formatWordsInArray(wordsArray) {
    // used to convert all the words to lowecase.
    for (var i in wordsArray) {
        wordsArray[i] = wordsArray[i].toString().toLowerCase().replace(/[^a-z]/gi, '');
    }
}

function calculateSum(wordsArray) {
    var sum = 0;

    var toNegate = false;
    //This keeps track of whether the score should be negated    
    var toMax = false; 
    //If there is a negator, then toMax turns true to ensure the sentence isn't too positive.
    //Eg: "I am happy" has a score of 3, but "I am not not happy" should have a lower score than 3.
    var multiplier = 1;
    //This is for emphasis words(boosters)

    var negation = false;
    for (var i in wordsArray) {
        if (offensiveSum >= 10) {
            // Redirect to a safe page if more than 10 offensive words are found.
            chrome.runtime.sendMessage({
                type: "redirect",
                redirect: chrome.extension.getURL("/html/safetypage.html")
            });
        }
        var newWord = wordsArray[i];
        var found = false;
        if (offensivewords.indexOf(newWord) != -1) {
            offensiveSum += 1;
        }

        if (words.hasOwnProperty(newWord)) {
            sum += words[newWord];
            found = true;
        }
        // check for booster array
        if (boosters.hasOwnProperty(newWord)) {
            //sum += boosters[newWord];
            switch(boosters[newWord]){
                case (1): multiplier *= 1.5;
                           break;
                case (-1): multiplier /= 1.5;
                            break;
            }
            found = true;
        }
        // there is a limitation to it. Two false won't make a true
        if (negs.hasOwnProperty(newWord)) {
            toNegate = !toNegate;
            toMax = true;
            found = true;
        }
        if (toNegate){
            sum *= -1;
            sum /= multiplier;
        }
        else {
            sum *= multiplier;
        }

        if (toMax){
          sum= Math.min.apply(null, [sum,1]);
        }
        if(!found && wordsLearnCalls<1 && !(learntWords.hasOwnProperty(newWord)) && globalWordsLearnCalls<maxGlobalWordsLearnCalls ) {	//Learning codes here. Can be tagged by postagger and put it in appropriate arrays!
        	// dictionary(newWord, function(data) {
        	//  	//console.log("New data " + JSON.stringify(data));
        	// });
          //console.log("new word to be learnt:" + newWord);
          // send the new word to be learnt to the server.
          var sendObj={
            word:newWord,
          };
          $.ajax({
                  url: "https://www.contentholmes.com/addNewWordInSentiment",
                  beforeSend: function(XhrObj) {
                      XhrObj.setRequestHeader("Content-Type", "application/json");
                  },
                  type: "POST",
                  data: JSON.stringify(sendObj)
              })
              .done(function(data) {
                  //console.log("New word sent to the server to be learnt");
              })
              .fail(function() {
                  //console.log("error in server upload to learn new word");
              });
          wordsLearnCalls++;
          globalWordsLearnCalls++;
          learntWords[newWord]=0;
          //console.log("Global calls to oxford="+globalWordsLearnCalls);
          chrome.storage.local.get(['global'], function(items) {
            var globalThingy=items.global;
            globalThingy.learningWordsCalls=globalWordsLearnCalls;
            globalThingy.learntWords=learntWords;
            chrome.storage.local.set({
              global:globalThingy
            });
          });

        }
    }
    if (negation == true) {
        sum = (-1) * sum;
    }
    return sum;
}

function getSentences(str) {
    // returns an array of sentences in the string str.
    const regex = /(\.\s)?([A-Z][^\.!\?]+[\.,!\?])/g;
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

    // console.log("Some error in MutationObserver");
}
