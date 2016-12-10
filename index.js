const Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	slapdeback = new Set(
		require('./words.json')
			.map(w => w.replace(/[^A-Z]/ig, '')));

twitter.stream('statuses/sample')
	.on('tweet', tweet => {
		const words = tweet.text
			.replace(/\b[\S]+:\/\/\S+\b/g, '')
			.replace(/\B[@#]\S+\b/g, '')
			.trim()
			.replace(/[\s."“”‘;,:–\/\\—?!@~*&£$(){}\[\]]+/g, ' ')
			.replace(/[’'-`]/g, '')
			.split(' ')
			.filter(word => 
				word != 'RT' &&
				word[0] != '@' &&
				/[a-z]/i.test(word))
			// .filter(word =>
			// 	word != 'RT' &&
			// 	/^[a-z\-']+$/i.test(word))
			.map(word => word.toUpperCase());

		const url = `http://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

		if (words.length == 2) {
			console.log(words, url);
		}

		if (words.length == 2 &&
			words[1] != 'CUMBERBATCH' &&
			words[1] != words[0] &&
			slapdeback.has(words[0]) &&
			slapdeback.has(words[1])) {
			console.log(words,
				url,
				'I loved him in Sherlock.');
			twitter.post('statuses/update', { status: `@{tweet.user.screen_name} I loved him in Sherlock.`,
				in_reply_to_status_id: tweet.id_str
			}, (err, data, response) => {
				console.log('DONE TWEETING',
					err, data, response);
			});
		}
	});
