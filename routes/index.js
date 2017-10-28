var express = require('express');
var router = express.Router();

var Resource = require('../models/Resource');


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
	
	console.dir(findResourceType(textMessage));


	res.send("<Response></Response>")
});

// Seperate out into util, and make more efficient?
function findResourceType(textMessage) {
	// @todo: add more resources
	const allResources = ["food", "water"];
	const parsedMessage = {
		resources: [],
		text: "",
	};

	// Find, note, and remove all resources from text
	for (var i = 0; i < allResources.length; i++) {
		if (textMessage.indexOf(allResources[i]) !== -1) {
			parsedMessage.resources.push(allResources[i]);
			if (!parsedMessage.text) {
				parsedMessage.text = textMessage.replace(allResources[i], "");
			} else {
				parsedMessage.text = parsedMessage.text.replace(allResources[i], "");
			}
		}
	}

	return parsedMessage;
}

module.exports = router;