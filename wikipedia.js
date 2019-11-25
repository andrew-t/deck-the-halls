const url = 'https://en.wikipedia.org/wiki/Special:Random',
	https = require('https'),
	words = require('./words.json'),
	stresses = '';

let ok = 0, dunno = 0, len = 0, bad = 0;

function get() {
	return new Promise((resolve, reject) =>
		https.get(url, (res, err) => {
			if (err) return reject(err);
			const loc = res.headers.location,
				title = decodeURIComponent(loc.split('/').pop()).replace(/_/g, ' ');
			resolve({title, loc});
		}));
}

function test({title, loc}) {

	let sp = title
		.toUpperCase()
		.split(' ')
		.map(w => w.replace(/^[^A-Z]|[^A-Z]$/g, ''))
		.map(w => words[w] || '*')
		.join('');

	// console.log(title
	// 	.toUpperCase()
	// 	.split(' ')
	// 	.map(w => w.replace(/^[^A-Z]+|[^A-Z]+$/g, '')), sp)

	if (sp === '010101') // the addams family
	{ ++ok; console.log('✔️ ', title, loc); }
	else if (/\*/.test(sp))		
	{ ++dunno; } //console.log('❓', title);
	else if (sp.length === 6)
	{ ++len; }// console.log('⚠️', title); }
	else
	{ ++bad; } //console.log('❌', title); }
}

function testN(n) {
	const a=[];
	while (n --> 0) a.push(get().then(test).catch(console.warn));
	return Promise.all(a);
}

async function testMN(m, n) {
	while (m --> 0) await testN(n);
}

testMN(25, 25);
