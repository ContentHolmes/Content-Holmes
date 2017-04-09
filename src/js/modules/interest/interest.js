/* Usage:
 *	1. Set a buffer object type. Initialize it by {}.
 *	2. Use interest(old_interests, query) to get new interests
 *	3. Save the buffer. Initialize the buffer next time by this value
 */

var pos = require('pos');

// module.exports = interest;
// module.exports.buffer = buffer_categories;

export default interest;
export {
	getBuffer, setBuffer
};

var pickup_categories = ['JJ', 'FW', 'NN', 'NNP', 'NNPS', 'NNS', 'VB', 'VBD', 'VBG', 'VBN', 'VBZ'];
var buffer_categories = {};
var MAX_LENGTH = 5;
var globals = {};

function interest(interests, query) {
	console.log(JSON.stringify(buffer_categories));
	console.log(interests);
	globals["interests"] =interests;
	query = query.toLowerCase();
	if(query in buffer_categories) {
		buffer_categories[query]++;
		if(buffer_categories[query]>=3&&globals.interests.indexOf(query)==-1) {
			globals.interests.push(query);
		}
		return globals.interests;
	}
	console.log("Posting: " + query);
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
		async: false,
		headers: { 'Api-User-Agent': 'Example/1.0'},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(!("-1" in data.query.pages)) {
				buffer_categories[query]= 1;
				console.log("Added:" + query);
			} else {
				nounextract(query);
			}
			console.log("Exiting:" + query);
		}
	});
	maintainance();
	console.log(JSON.stringify(buffer_categories));
	console.log(interests);
	return globals.interests;
}

function nounextract(sentence) {
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
	    			buffer_nouns.push(word);
	    		}
	    	} else {
	    		buffer_categories[word] = 1;	
				console.log("Added from nouns:" + word + +"\t" + tag);
	    	}
	    }
	}
	for(var i = 0; i<buffer_nouns.length; i++) {
		interest_determined+=buffer_nouns[i]_" ";
	}
	if(interest_determined!=""&&globals.interests.indexOf(interest_determined)==-1) {
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
	//Resizing buffer
	for(var key in buffer_categories) {
		if(buffer_categories[key]>3) {
			buffer_categories[key] = 3;
		} else if(buffer_categories[key]<=1) {
			delete buffer_categories[key];
		}
	}
}

function setBuffer(buffer) {
	buffer_categories = buffer;
}

function getBuffer() {
	return buffer_categories;
}