var mongoose = require('mongoose');
var Twit = require('twit');
Promise = require('bluebird');

var sentiment = require('../utils/sentiment');
var Tweet = require('../models/Tweet');

// mongoose.Promise = Promise;

var twitter = new Twit({
	consumer_key: '***REMOVED***',
 	consumer_secret: '***REMOVED***',
	access_token: '***REMOVED***',
 	access_token_secret: '***REMOVED***',
 	timeout_ms: 60*1000,
})

// Lat, long, radius for twitter search region
const searchRegion = ['29.725407','-95.346017','20mi']

var relevantTweets = [];

function relevantTweet(tweet) {
	if (tweet.coordinates && !tweet.possibly_sensitive) {
		return true;
	}

	return false;
}

// Get tweets in increments of a hundred
async function getTweets(count) {
	noMoreTweets = 0;
	minId = null;

	while (count > relevantTweets.length && noMoreTweets < 5) {
		await twitter.get('search/tweets', {
			result_type: 'recent',
			include_entities: false,
			max_id: minId,
			count: 100,
			geocode: searchRegion}, function(err, data, response) {
		  const statuses = data.statuses;
		  statuses.map((tweet) => relevantTweet(tweet) ? relevantTweets.push(tweet) || (noMoreTweets++) : null);

		  // Find minId to keep querying for older tweets (max. 100 tweets per request)
		  minId = !minId
		  	? statuses.reduce((acc, tweet) => tweet.id < acc ? tweet.id : acc, 9924317044341989400)
		  	: statuses.reduce((acc, tweet) => tweet.id < acc ? tweet.id : acc, minId)
		})
		console.log('Still going with < 5 r', noMoreTweets, 'at', relevantTweets.length, "minId", minId);
	}
	console.log("Relevant:", relevantTweets.length);

	saveTweets(relevantTweets);
}

function saveTweets(relevantTweets) {
	// Add tweets to db
	for (var i = 0; i < relevantTweets.length; i++) {
		const newTweet = {
			name: relevantTweets[i].user.name,
			lat: relevantTweets[i].geo.coordinates[0],
			lng: relevantTweets[i].geo.coordinates[1],
			region: relevantTweets[i].place.name,
			sentiment: sentiment.value(relevantTweets[i].text),
		};

		Tweet.create(newTweet, function(err, doc) {
    		if (err)
      			return next(err);

			console.log("New tweet added");
  		});
	}
}

module.exports = {
	getTweets,
}