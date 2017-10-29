(function() {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    // Sentiment schema
    var SentimentIntensitySchema = new Schema(
    {
        sentiment: Number,
        lat: Number,
        lng: Number,
    }, { "collection": "sentiments" });

module.exports = mongoose.model('Sentiment', SentimentIntensitySchema);

})();