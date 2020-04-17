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
    companyLinksQuantity: {
        type: String,
        required: true
    },
    companyLinks: [{
        type: String,
        required: true
    }],
    companyIds: [{
        type: Number,
        required: true
    }],
});

module.exports = mongoose.model("GeneralInfo", generalInfoSchema);
