var express = require('express');
var router = express.Router();

var Resource = require('../models/Resource');

// @todo: move outta here
var googleMapsClient = require('@google/maps').createClient({
  key: '***REMOVED***'
});


// Use with @testdata
// const testData = [
// 	{"supplies": ["water"], "lat": 18.391606, "lng": -66.08923, "contact": 12345754269},
// 	{"supplies": ["water"], "lat": 18.396776, "lng": -66.099075, "contact": 12345754269},
// 	{"supplies": ["water"], "lat": 18.173806, "lng": -65.792134, "contact": 12345754269},
// 	{"supplies": ["water"], "lat": 18.109212, "lng": -66.094258, "contact": 12345754269},
// 	{"supplies": ["water"], "lat": 18.279797, "lng": -66.331837, "contact": 12345754269},
// 	{"supplies": ["water"], "lat": 17.995954, "lng": -67.150318, "contact": 12345754269},
// 	{"supplies": ["water"], "lat": 18.094379, "lng": -67.179844, "contact": 12345754269},
// 	{"supplies": ["water"], "lat": 18.222427, "lng": -66.971790, "contact": 12345754269},
// ]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/api/resources', (req, res, next) => {
  Resource.find((err, doc) => {
    if (err)
      return next(err);
  	console.dir(doc);
    res.json(doc);
  });
});

// Use with @testdata
// router.get('/api/resources',function(req,res,next){
//   res.send(testData);
// });

router.post('/api/resources', function(req, res, next) {
  console.dir(req.body);
  Resource.create(req.body, function(err, doc) {
    if (err)
      return next(err);

  	console.dir(doc);
    res.json({
      success: true,
      resource: doc
    });
  });
});

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
    		// 	Resource.create(newResource, function(err, doc) {
		   //  if (err)
		   //    	return next(err);

		  	// 	console.dir(doc);
		  	// 	res.send("<Response><Message>It worked! " + formattedResponse + "</Message></Response>")
		  	// });
		  	res.send("<Response><Message>Adding resources via text temporarily disabled.</Message></Response>")

  		} else if (response.json.results.length) {
  			res.send("<Response><Message>Address ambiguous. Please try again.</Message></Response>")
  		} else {
  			console.log("Couldn't recognize address");
  			res.send("<Response><Message>We couldn't recognize your address.</Message></Response>");
  		}
	});
});

// Seperate out into util, and make more efficient?
function findResourceType(textMessage) {
	// @todo: add more resources
	const allResources = ["food", "water"];
	const lowerTextMessage = textMessage.toLowerCase();
	const parsedMessage = {
		resources: [],
		text: "",
	};

	// Find, note, and remove all resources from text
	for (var i = 0; i < allResources.length; i++) {
		if (lowerTextMessage.indexOf(allResources[i]) !== -1) {
			parsedMessage.resources.push(allResources[i]);
			if (!parsedMessage.text) {
				parsedMessage.text = lowerTextMessage.replace(allResources[i], "");
			} else {
				parsedMessage.text = parsedMessage.text.replace(allResources[i], "");
			}
		}
	}

	return parsedMessage;
}

module.exports = router;