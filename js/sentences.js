function getSentences(str) {
	const regex = /(\.\s)?([A-Z][^\.!\?]+[\.!\?])/g;
	var sentences = [];
	str = str+".";

	while ((m = regex.exec(str)) !== null) {
	    // This is necessary to avoid infinite loops with zero-width matches
	    if (m.index === regex.lastIndex) {
	        regex.lastIndex++;
	    }
	    sentences.push(m[0]);
	}
	console.log(sentences);
	return sentences;
}
