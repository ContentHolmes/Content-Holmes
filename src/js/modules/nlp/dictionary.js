var app_id = 	'b067ddd7';
var key = 	'7c5ecf496dbd3f2bd810f9e615716e94';
var base = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/';

module.exports = getDefinition;
module.exports.getAlterWords = getAlterWords;

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