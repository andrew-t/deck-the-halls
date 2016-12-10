const Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	stressPatterns = {},
	falala = [
		'Falalalala, la la, la la!',
		'Falalalala, la la, la la!',
		'Falala, lalala, la la la!',
		'Falalalala, la la, la laaaa!'
	],
	done = new Set();
let nextFalala = 0;

require('fs')
	.readFileSync('dict.txt')
	.toString()
	.split('\n')
	.filter(line =>
		line.length &&
		line[0] !== ';')
	.map(line => {
		const parts = line.split('  '),
			word = parts[0],
			stressPattern = parts[1].replace(/[^\d]/g, '');
		return {
			word: word.replace(/\(\d+\)$/, ''),
			stressPattern
		};
	})
	.forEach(word => stressPatterns[word.word] = word.stressPattern);

twitter.stream('statuses/sample')
	.on('tweet', process);

twitter.stream('user', { with: 'followings' })
	.on('tweet', process);

function process(tweet) {
	if (tweet.retweeted_status)
		tweet = tweet.retweeted_status;

	const words = tweet.text
		.replace(/&amp;/gi, 'AND')
		.replace(/&[a-z]+;/gi, '***')
		.replace(/\b[\S]+:\/\/\S+\b/g, '')
		.replace(/\B[@]\S+\b/g, '')
		.trim()
		.replace(/[\s."“”‘;,:–\/\\—?!@~\*&£$(){}\[\]]+/g, ' ')
		.replace(/[’'\-`#]/g, '')
		.split(' ')
		.filter(word => 
			word != 'RT' &&
			word[0] != '@' &&
			/[a-z]/i.test(word))
		.map(word => word.toUpperCase());

	const url = `http://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
		stresses = words.map(word => stressPatterns[word] || 'x').join('');

	if (/^([1-9]0){4}$/.test(stresses)) {
		let w = words.join(' ');
		console.log(
			tweet,
			w,
			stresses,
			url);
		if (done.has(w))
			return;
		done.add(w);
		twitter.post('statuses/update', {
			status: `${falala[nextFalala]} ${url}`,
			in_reply_to_status_id: tweet.id_str
		}, (err, data, response) => {
			console.log('DONE TWEETING', err, data, response);
		});
		nextFalala = (nextFalala + 1) % 4;
	}
}
