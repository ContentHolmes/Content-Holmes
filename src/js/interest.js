var pos = require('pos');

module.exports = interest;
module.exports.buffer = buffer_categories;

var pickup_categories = ['JJ', 'FW', 'NN', 'NNP', 'NNPS', 'NNS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'];
var buffer_categories = {};
var globals = {};

function interest(interests, query) {
	globals["interests"] =interests;
	if(query in buffer_categories) {
		buffer_categories[query]++;
		if(buffer_categories[query]>=3&&interests.indexOf(query)==-1) {
			interests.push(query);
		}
		return interests;
	}
	// console.log("Posting: " + query);
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
			if(!("-1" in data.query.pages)) {
				buffer_categories[query]= 1;
				// console.log("Added:" + query);
			} else {
				nounextract(query);
			}
			// console.log("Exiting:" + query);
		}
	});
	console.log(interests);
	return interests;
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
	    		buffer_categories[word] = 0;
	    	}
	    }
	}
	for(var i = 0; i<buffer_nouns.length; i++) {
		interest_determined+=buffer_nouns[i];
	}
	if(interest_determined!=""&&globals.interests.indexOf(interest_determined)==-1) {
		globals.interests.push(interest_determined);
	}
}