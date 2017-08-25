/**
 * <tt>dictionary</tt> is an interface to the oxford dictionary API, to get meanings, synonyms and antonyms of the words.
 * @example
 * var dictionary = require('dictionary.js');
 * dictionary("hey", function(data) {
 *		console.log(JSON.stringify(data));
 * });
 * @module nlp/dictionary
 */


/* Usage:
 * dictionary(word, callback): Returns definition of the word along woth some synonyms and antonyms
 * dictionary.getAlterWords(word, callback): Returns synonyms and antonyms of the word exclusively.
 */

var app_id = 	'b067ddd7';
var key = 	'7c5ecf496dbd3f2bd810f9e615716e94';
var base = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/';

module.exports = getDefinition;
module.exports.getAlterWords = getAlterWords;

/**
 * Gets Synonyms and Antonyms of the word sent.
 * @param {String} word The word whose alternatives are needed.
 * @param {Function} callback The function is called as soon as the call to Oxford completes. The single callback is the alternate words received from Oxford.
 */

function getAlterWords(word, callback) {
	$.ajax({
		url:base+word+'/synonyms;antonyms',
		type: 'GET',
		async: false,
		headers: {
			app_id: app_id,
			app_key: key
		},
		success: function(data) {
			words = data;
			callback(data);
		}
	});
}

/**
 * Gets meaning and other information of the word sent.
 * @param {String} word The word whose info is needed.
 * @param {Function} callback The function is called as soon as the call to Oxford completes. The single callback is the alternate words received from Oxford.
 */

function getDefinition(word, callback) {
	$.ajax({
		url:base+word,
		type: 'GET',
		async: false,
		headers: {
			app_id: app_id,
			app_key: key
		},
		success: function(data) {
			words = data;
			callback(data);
		}
	});
}