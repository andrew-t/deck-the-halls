fs = require('fs');

var hash = {};

fs.readFileSync('dict.txt')
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
	.forEach(word => hash[word.word] = word.stressPattern);

fs.writeFileSync('words.json',
	JSON.stringify(hash, null, 2));
