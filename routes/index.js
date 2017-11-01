var _ = require('lodash');
var express = require('express');
var router = express.Router();

var Resource = require('../models/Resource');
var Tweet = require('../models/Tweet');
var Sentiment = require('../models/Sentiment');
var findResourceType = require('../utils/resources').findResourceType;
var getTweets = require('../utils/analyze-tweets').getTweets;
var getIntensities = require('../utils/analyze-tweets').getIntensities;
var CONSTANTS = require('../utils/constants');

// @todo: move outta here
var googleMapsClient = require('@google/maps').createClient({
  key: 'REPLACE_WITH_KEY'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/api/resources', (req, res, next) => {
  Resource.find((err, doc) => {
    if (err)
      return next(err);

    res.json(doc.map((resource) => _.pick(resource, CONSTANTS.RESOURCE.RETURNABLE_FIELDS)));
  });
});

router.post('/api/resources', function(req, res, next) {
  // console.dir(req.body);
  // top left: 29.906365, -95.5233427
  // top right: 29.906365, -95.1832977
  // bottom left: 29.620715, -95.5233427
  // bottom right: 29.620715, -95.1832977
  var supplies = ["food"];

  for (var lng = -95.3233427 + (Math.random() / 15); lng < -95.2732977; lng += ((0.340045 / 50) + (Math.random() / 10))) {
  	for (var lat = 29.786365 + (Math.random() / 15); lat > 29.760715; lat -= ((0.28565 / 50) + (Math.random() / 10))) {
  		if (Math.random() < 0.2) {
  			supplies = ["water", "food"];
  		} else if (Math.random() < 0.4) {
  			supplies = ["rescue"];
  		} else if (Math.random() < 0.6) {
  			supplies = ["medical", "rescue"]
  		} else if (Math.random() < 0.8) {
  			supplies = ["food", "medical"];
  		} else {
  			supplies = ["food", "water", "medical", "rescue"];
  		}

  		newResource = {
  			"contact": 18476518454,
  			lat,
  			lng,
  			supplies,
  		}
  		console.dir('Creating new resource', newResource);
  		Resource.create(newResource, function(err, doc) {
		    if (err)
		      return next(err);
  		});
  	}
  }

  // for (var i = 0; i < req.body.length; i++) {
  // 	Resource.create(req.body, function(err, doc) {
	 //    if (err)
	 //      return next(err);
  // 	});
  // }
  res.json({
      success: true,
  });
});

// Return tweets in geographic area with sentiment
router.get('/api/tweets', async function(req, res, next) {
	Tweet.find((err, doc) => {
	    if (err)
	      return next(err);

    	res.json(doc.map((tweet) => _.pick(tweet, CONSTANTS.TWEET.RETURNABLE_FIELDS)));
  	});
})

// Fetch tweets within geographic area with sentiment
router.post('/api/tweets', async function(req, res, next) {
	Tweet.find((err, doc) => {
	    if (err)
	      return next(err);

    	res.json(doc);
  	});
})

router.get('/api/sentiment', function(req, res, next) {
	Sentiment.find(async (err, doc) => {
	    if (err)
	      return next(err);

	  	res.json(doc.map((tweet) => _.pick(tweet, CONSTANTS.SENTIMENT.RETURNABLE_FIELDS)));
  	}).limit(36);
})

// Determine tweets within geographic area for sentiment intensity
router.post('/api/sentiment', async function(req, res, next) {
	// console.log('Numtweets = ', req.body.numTweets)
	Tweet.find(async (err, doc) => {
	    if (err)
	      return next(err);

	  	await getIntensities(doc)
    	res.send(201);
  	}).limit(1000);
})

// Parse incoming texts (incomplete), and respond with blank TwiML to not respond
router.post('/api/texts', function(req, res, next) {
	console.log("Incoming text:", req.body.Body, "\nFrom:", req.body.From);

	const textMessage = req.body.Body;
	const fromNumber = req.body.From;
	
	// Extract resources from text
	console.dir(findResourceType(textMessage));
	const semiParsedText = findResourceType(textMessage);

	// Attempt to geocode remaining text
	// @todo: store resource types and send clarifying text about address if address can't be coded
	googleMapsClient.geocode({
  		address: semiParsedText.text
	}, function(err, response) {
  		if (!err && response.json.results.length === 1) {
  			const location = response.json.results[0].geometry.location;
    		console.log(response.json.results[0].geometry.location);

    		var formattedResources = "";
    		for (var i = 0; i < semiParsedText.resources.length; i++){
    			if (i === 0) {
    				formattedResources = semiParsedText.resources[i];
    			} else {
    				formattedResources = `${formattedResources} and ${semiParsedText.resources[i]}`;
    			}
    		}

    		const formattedResponse = `Added a resource of ${formattedResources} at ${location.lat}, ${location.lng}.`;
    		const newResource = {
    			"supplies": semiParsedText.resources,
    			"contact": fromNumber,
    			"lat": location.lat,
    			"lng": location.lng,
    		};


    		// Keep resources clean while testing. Uncomment when ready to use
    		Resource.create(newResource, function(err, doc) {
		    if (err)
		      	return next(err);

		  		console.dir(doc);
		  		 global.io.emit('help_request', newResource);
		  		res.send("<Response><Message>Received! " + formattedResponse + "</Message></Response>")
		  	});
		  	// res.send("<Response><Message>Adding resources via text temporarily disabled.</Message></Response>")

  		} else if (response.json.results.length) {
  			res.send("<Response><Message>Address ambiguous. Please try again.</Message></Response>")
  		} else {
  			console.log("Couldn't recognize address");
  			res.send("<Response><Message>We couldn't recognize your address.</Message></Response>");
  		}
	});
});

module.exports = router;