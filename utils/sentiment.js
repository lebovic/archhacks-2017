var sentiment = require('sentiment');

// function negative(text) {
// 	return sentiment(text).score < 0;
// }

function value(text) {
	return sentiment(text).score;
}

module.exports = {
	// negative,
	value,
}