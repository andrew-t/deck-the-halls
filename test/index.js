var ttw = require('../tweet-to-words');

describe('Wordenizer', function() {

	i('this is some,  text',
		'THIS IS SOME TEXT');

	i('@hey @whatsup @nopes  this is #some text?!!?',
		'THIS IS SOME TEXT');

	i('  .@hey @whatsup   @nopes this is   some text http://www.link.com/link?link=link',
		'THIS IS SOME TEXT');

	i(' this  is some    text http://www.link.com/link?link=link  ',
		'THIS IS SOME TEXT');

	i(' this  is some    text http://www.link.com/link?link=link  wait this is more',
		null);

	function i(input, expected) {
		it('should work on "' + input + '"', function() {
			var actual = ttw(input);
			if (actual)
				actual = actual.join(' ');
			if (actual !== expected)
				throw new Error('Got "' + actual + '"');
		});
	}

});
