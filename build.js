fs = require('fs');

var words = fs
	.readFileSync('dict.txt')
	.toString()
	.split('\n')
	.filter(line =>
		line.length &&
		line[0] !== ';')
	.map(line => {
		const parts = line.split('  '),
			word = parts[0],
			beats = parts[1].split(' '),
			stressPattern = beats
				.map(beat => beat[beat.length - 1])
				.filter(c => /\d/.test(c))
				.join('');
		return {
			word: word.replace(/\(\d+\)$/, ''),
			stressPattern,
			ok: /^[1-9]0[1-9]$/.test(stressPattern)
		};
	})
	.filter(word => word.ok)
	.map(word => word.word);

fs.writeFileSync('words.json',
	JSON.stringify(words, null, 2));
