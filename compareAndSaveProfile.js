
const compareAndSaveProfile = async profileObject => {
    try {
        const Profile = require('./models/Profile');
        await Profile.findOneAndUpdate(
            {ticker: profileObject.ticker},
            profileObject,
            { new: true, upsert: true },
            (err, doc) => {
                if (err) console.log(err);
            })
    } catch (err) {
        console.error(err);
    }
};
module.exports = compareAndSaveProfile;
