/* Usage:
 *	1. Set a buffer object type. Initialize it by {}.
 *	2. Use interest(old_interests, query) to get new interests
 *	3. Save the buffer. Initialize the buffer next time by this value
 */

var pos = require('pos');

// module.exports = interest;
// module.exports.buffer = buffer_categories;

export {
	getBuffer, setBuffer, wordextract, interest
};

var pickup_categories = ['JJ', 'FW', 'NN', 'NNP', 'NNPS', 'NNS', 'VB', 'VBD', 'VBG', 'VBN', 'VBZ'];
var sentiment_categories = ['JJ', 'FW', 'NN', 'NNS', 'VB', 'VBD', 'VBG', 'VBN', 'VBZ'];
var buffer_categories = {};
var MAX_LENGTH = 10;
var globals = {};

function interest(interests, query, callback) {
	//console.log(JSON.stringify(buffer_categories));
	//console.log(interests);
	globals["interests"] =interests;
	query = query.toLowerCase();
	console.log(JSON.stringify(buffer_categories));
	if(query in buffer_categories) {
		buffer_categories[query]++;
		if(buffer_categories[query]>=3&&globals.interests.indexOf(query)==-1) {
			globals.interests.push(query);
			fireChangeEventListener();
		}
		// console.log(interests);
		// console.log(JSON.stringify(buffer_categories));
		callback(interests, buffer_categories);
		return;
	}
	//console.log("Posting: " + query);
	$.ajax({
		url: 'https://en.wikipedia.org/w/api.php',
		data: {
			"action": "query",
			"format": "json",
			"prop": "categories",
			"titles": query
		},
		dataType: 'json',
		type:'POST',
		async: true,
		headers: { 'Api-User-Agent': 'Example/1.0'},
		success: function(data) {
			//console.log(JSON.stringify(data));
			if(!("-1" in data.query.pages)) {
				buffer_categories[query]= 1;
				//console.log("Added:" + query);
			} else {
				wordtagger(query);
			}
			//console.log("Exiting:" + query);
			maintainance();
			callback(interests,buffer_categories);
		}
	});
}

function wordtagger(sentence) {
	var interest_determined = "";
	var buffer_nouns = [];
	var words = new pos.Lexer().lex(sentence);
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag(words);
	for(var i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
	    var tag = taggedWord[1];
	    if(pickup_categories.indexOf(tag)!=-1) {
	    	if(word in buffer_categories) {
	    		buffer_categories[word]++;
	    		if(buffer_categories[word]>=3) {
	    			delete buffer_categories[word];
	    			buffer_nouns.push(word);
	    		}
	    	} else if(word.length>4) {
	    		buffer_categories[word] = 1;
				//console.log("Added from nouns:" + word + +"\t" + tag);
	    	}
	    }
	}
	for(var i = 0; i<buffer_nouns.length; i++) {
		interest_determined+=buffer_nouns[i]+" ";
	}
	if(interest_determined!=""&&globals.interests.indexOf(interest_determined)==-1) {
		fireChangeEventListener();
		globals.interests.push(interest_determined);
	}
}

function maintainance() {
	if(globals.interests.length<=MAX_LENGTH) {
		return;
	}
	//Resizing interests to MAX_LENGTH
	while(globals.interests.length>MAX_LENGTH) {
		var ele = globals.interests.shift();
		delete buffer_categories[ele];
	}
	//Randomly clearing the buffer 10% of the times
	if(Math.floor((Math.random() * 5*MAX_LENGTH))==9) {
		buffer_categories = {};
		for(var i=0; i< globals.interests.length && i<MAX_LENGTH; i++) {
			buffer_categories[globals.interests[i]] = 3;
		}
		return;
	}
	//Rebasing buffer if its not cleared
	for(var key in buffer_categories) {
		if(buffer_categories[key]>3) {
			buffer_categories[key] = 3;
		}
	}
}

function setBuffer(buffer) {
	buffer_categories = buffer;
}

function getBuffer() {
	return buffer_categories;
}

function addChangeEventListener(fn) {
	globals["changeEventListener"] = fn;
}

function fireChangeEventListener() {
	if(globals["changeEventListener"]) {
		globals["changeEventListener"](globals["interests"])
	}
}

function wordextract(sentence) {
	var values = [];
	var words = new pos.Lexer().lex(sentence);
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag(words);
	for(var i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
	    var tag = taggedWord[1];
	    if(sentiment_categories.indexOf(tag)!=-1) {
	    	values.push(word);
	    }
	}
	return values;
}