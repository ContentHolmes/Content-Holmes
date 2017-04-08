var pos = require('pos');

module.exports = nounextract;

function nounextract(sentence) {
	var words = new pos.Lexer().lex(sentence);
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag(words);
	for(i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
	    var tag = taggedWord[1];
	    console.log(word + " /" + tag);
	}
}