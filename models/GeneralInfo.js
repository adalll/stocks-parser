const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalInfoSchema = new Schema ({
    date: {
        type: Date,
        required: true
    },
    siteURL: {
        type: String,
        required: true
    },
    siteName: {
        type: String,
        required: true
    },
    stocksLinksQuantity: {
        type: String,
        required: true
    },
    stocksLinks: [{
        type: String,
        required: true
    }]
}, { collection: 'generalData' });

module.exports = mongoose.model("GeneralInfo", generalInfoSchema);
