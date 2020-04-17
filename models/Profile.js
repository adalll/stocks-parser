const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
// INVESTING.COM DATA
    lastUpdated: {
        type: Date,
        required: true
    },
    ticker: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    investingCompanyURL: {
        type: String,
        required: true
    },
    investingCompanyId: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    peRatio: {
        type: String,
        required: true
    },
    eps: {
        type: String,
        required: true
    },
    marketCap: {
        type: String,
        required: true
    },
    oneYearChange: {
        type: String,
        required: true
    },
    nextEarningsDate: {
        type: String,
        required: true
    },
// DIVIDEND.COM DATA
    industry: {
        type: String,
        required: true
    },
    dividendYield: {
        type: String,
        required: true
    },
    annualizedPayout: {
        type: String,
        required: true
    },
    payoutRatio: {
        type: String,
        required: true
    },
    dividendGrowth: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Profile", profileSchema);
