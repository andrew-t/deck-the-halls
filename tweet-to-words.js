// var dictionary = require('./dictionary');

module.exports = function ttw(text) {
	var processedText = text
		.trim()
		// Strip @names from the start
		.replace(/^(\W*(RT\s+)?@\S+\s*)*/g, '')
		// Strip links from the end
		.replace(/\b(\s+[\S]+:\/\/\S+)*$/g, '');

	// If there's a link in the body of the tweet,
	// bail, we can't handle this stuff
	if (/:\/\//.test(processedText))
		return null;

	processedText = processedText
		// Replace ampersands with the word "and"...
		.replace(/&amp;/gi, 'AND')
		// Remove punctuation and collapse whitespace.
		.replace(/[\s."“”‘;,:–\/\\—?!@~\*&£$(){}\[\]]+/g, ' ')
		.replace(/&[a-z]+;/gi, '')
		// Remove characters we don't care about.
		// This includes hashes - any hashtags that are words will therefore be allowed.
		.replace(/[’'\-`#]/g, '')
		.trim();

	// Split into an array of uppercase words
	return processedText
		.toUpperCase()
		.split(' ');
};

