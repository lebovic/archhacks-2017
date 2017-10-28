(function() {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    // Resource schema
    // Supplies as of now just includes "water"
    // @todo: phone number regex
    var ResourceSchema = new Schema(
    {
        supplies: Array,
        lat: Number,
        lng: Number,
        contact: Number,
    }, { "collection": "resources" });

module.exports = mongoose.model('Resource', ResourceSchema);

})();