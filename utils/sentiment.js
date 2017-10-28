var sentiment = require('sentiment');

function negative(text) {
	return sentiment(text).score < -5;
}

function value(text) {
	return sentiment(text).comparative;
}

module.exports = {
	negative,
	value,
}