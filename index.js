var Twit = require('twit'),
	twitter = new Twit(require('./creds.json')),
	dictionary = require('./dictionary'),
	wordenize = require('./tweet-to-words'),
	falala = [
		'Falalalala, la la, la la!',
		'Falalalala, la la, la la!',
		'Falala, lalala, la la la!',
		'Falalalala, la la, la laaaa!'
	],
	done = {},
	nextFalala = 0,
	timeOfLastTweet = 0,
	// Only do one full tweet every half hour
	tweetInterval = 30 * 60 * 1000;

twitter.stream('statuses/sample')
	.on('tweet', process);

twitter.stream('user', { with: 'followings' })
	.on('tweet', process);

function process(tweet) {
	if (tweet.retweeted_status)
		tweet = tweet.retweeted_status;

	// We really can't handle Cyrillic text well so just bail if the tweet contains any:
	if (/[водвыпустилтысячныйвтомобильИзвестныйитальянскийпроизводительавтомобилейвыпустилназаводевгороде]/i.test(tweet.text))
		return;

	var words = wordenize(tweet.text);
	if (!words)
		return;

	var stresses = words
			.map(function(word) {
				var entry = dictionary[word];
				return entry ? entry.stressPattern : 'x';
			})
			.join('');

	// console.log(words, stresses);

	if (/^([1-9]0){4}$/.test(stresses)) {
		// Not sure what sort of API doesn't include this but hey-ho:
		var url = 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
		
		var w = words.join(' ');
		console.log(
		//	tweet,
			w,
			stresses,
			url);
		if (done[w])
			return;
		done[w] = true;

		var timeOfThisTweet = Date.now(),
			snark;
		if (timeOfLastTweet < timeOfThisTweet - tweetInterval) {
			// It's been a while since we did a proper tweet;
			// do this one as a full-on retweet.
			snark = falala[nextFalala] + ' ' + url;
			nextFalala = (nextFalala + 1) % 4;
			timeOfLastTweet = timeOfThisTweet;
		} else
			// Tweet it as a reply so as not to spam our followers
			snark = '@' + tweet.user.screen_name + ' ' + falala[0];

		twitter.post('statuses/update', {
			status: snark,
			in_reply_to_status_id: tweet.id_str
		}, function(err, data, response) {
			if (err)
				console.log('Error tweeting', err);
		});
	}
}
