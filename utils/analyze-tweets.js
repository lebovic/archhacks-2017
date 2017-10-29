var _ = require('lodash');
var mongoose = require('mongoose');
var Twit = require('twit');
Promise = require('bluebird');

var sentiment = require('../utils/sentiment');
var Tweet = require('../models/Tweet');
var Sentiment = require('../models/Sentiment');

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

	filterAndSave(relevantTweets);
}

async function getIntensities(relevantTweets) {

	var sentimentSum = 0;
	var formattedTweets = relevantTweets;
	for (var i = 0; i < relevantTweets.length; i++) {
		sentimentSum += sentiment.value(relevantTweets[i].text);
	}

	// Find mean for extremes
	var meanSentiment = sentimentSum / relevantTweets.length;
	console.log('Mean sentiment', meanSentiment);

	formattedTweets = formattedTweets.sort((t1, t2) => t1.lng - t2.lng || t1.lat - t2.lat);
	preIntensities = [[],[],[],[],[],[]];
	intensities = [[],[],[],[],[],[]];
	var virtualLength = formattedTweets.length / 6;

	// Because mental math is hard
	for (var i = 0; i < formattedTweets.length; i++) {
		var index = Math.floor(i / virtualLength);
		preIntensities[index].push(formattedTweets[i]);
	}

	console.log('intensities', preIntensities);

	// Get 36 intensities
	var minIntensity = 100;
	var maxIntensity = -100;
	for (var i = 0; i < preIntensities.length; i++) {
		var intensity = meanSentiment;
		for (var j = 0; j < preIntensities[i].length; j++) {
			console.log("Intensity in", preIntensities[i][j]);
			if (j === 0) {
				intensity = preIntensities[i][j].sentiment;
				location = {lat: preIntensities[i][j].lat, lng: preIntensities[i][j].lng};
			} else {
				if (Math.abs(meanSentiment - intensity) > Math.abs(meanSentiment - preIntensities[i][j].sentiment)) {
					intensity = (0.8 * intensity) + (0.2 * preIntensities[i][j].sentiment);
					location = {
						lat: (0.8 * location.lat) + (0.2 * preIntensities[i][j].lat),
						lng: (0.8 * location.lng) + (0.2 * preIntensities[i][j].lng),
					}
				} else {
					intensity = (0.2 * intensity) + (0.8 * preIntensities[i][j].sentiment);
					location = {
						lat: (0.2 * location.lat) + (0.8 * preIntensities[i][j].lat),
						lng: (0.2 * location.lng) + (0.8 * preIntensities[i][j].lng),
					}
				}
			}

			if ((j + 1) % 6 === 0) {
				if (intensities[i].length < 6) {
					intensities[i].push({intensity, location});
				}

				if (intensity < minIntensity) {
					minIntensity = intensity;
				}
				if (intensity > maxIntensity) {
					maxIntensity = intensity;
				}

				intensity = meanSentiment; 
			}
		}
	}

	console.log('down intensities', intensities);

	var range = maxIntensity - minIntensity;

	console.log('Makes it down here');

	// Normalize and save tweet intensities to database
	for (var i = 0; i < intensities.length; i++) {
		for (var j = 0; j < intensities[i].length; j++) {
			console.log('Final lat? ', intensities[i][j]);
			newTweetIntensity = {
				lat: intensities[i][j].location.lat,
				lng: intensities[i][j].location.lng,
				sentiment: 2*((intensities[i][j].intensity - minIntensity) / (maxIntensity - minIntensity)) - 1,
			}

			Sentiment.create(newTweetIntensity, function(err, doc) {
    			if (err)
      				return next(err);

				console.log("New tweet intensity added");
  			});
		}
	}
}

module.exports = {
	getTweets,
	getIntensities,
}