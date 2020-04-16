const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/parsingdb', {
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));

const updateOnListingStatus = () => {
    try {
        const Profile = require('./models/Profile');
        Profile.find({}, (err, profile) => {
            return console.log(profile);
        })
            .then(() => mongoose.disconnect())
            .catch(err => console.log(err));
        // Profile.findOneAndUpdate(
        //     {profileId: profileObject.profileId},
        //     profileObject,
        //     {upsert:true},
        //     (err, doc) => {
        //         if (err) console.log(err);
        //         console.log(doc)
        //     })
        //
    } catch (err) {
        console.error(err);
    }
};
updateOnListingStatus();

module.exports = updateOnListingStatus;
