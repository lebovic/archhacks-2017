(function() {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    // Tweet schema
    var TweetSchema = new Schema(
    {
        name: String,
        lat: Number,
        lng: Number,
        region: String,
        sentiment: Number,
    }, { "collection": "tweets" });

module.exports = mongoose.model('Tweet', TweetSchema);

})();