module.exports = {};

require('fs')
	.readFileSync('dict.txt')
	.toString()
	.split('\n')
	.filter(function(line) {
		return line.length && line[0] !== ';';
	})
	.map(function(line) {
		var parts = line.split('  '),
			word = parts[0],
			stressPattern = parts[1].replace(/[^\d]/g, '');
		return {
			word: word.replace(/\(\d+\)$/, ''),
			stressPattern: stressPattern
		};
	})
	.forEach(function(word) {
		module.exports[word.word] = {
			stressPattern: word.stressPattern
		};
	});
