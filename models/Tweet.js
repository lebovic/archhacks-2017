(function() {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    // Tweet schema
    var TweetSchema = new Schema(
    {
        lat: Number,
        lng: Number,
        sentiment: Number,
    }, { "collection": "tweets" });

module.exports = mongoose.model('Tweet', TweetSchema);

})();