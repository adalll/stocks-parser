const Profile = require('./models/Profile');

const compareAndSaveProfile = async profileObject => {
    try {
        await Profile.findOneAndUpdate(
            {ticker: profileObject.ticker},
            profileObject,
            { upsert: true },
            (err, doc) => {
                if (err) console.log('MONGO PROFILE WRITING ERROR: ',err);
            })
    } catch (err) {
        console.error('COMPARE AND SAVE PROFILE ERROR: ', err);
    }
};
module.exports = compareAndSaveProfile;
