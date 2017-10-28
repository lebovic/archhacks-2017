var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');


router.get('/api/resources',function(req,res,next){
  res.send({'test': 'testr'});
});

/* GET home page. */
// router.get('*', function(req, res, next) {
//   res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
// });

module.exports = router;
