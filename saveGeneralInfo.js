
const saveGeneralInfo = async generalInfoObject => {

    try {
        const generalInfo = require('./models/GeneralInfo');
        const newGeneralInfo = new generalInfo(generalInfoObject);
        await newGeneralInfo.save()
            .then(() => {
                console.log('GENERAL INFO SAVED');
            })
            .catch(err => console.log(err));
    } catch (err) {
        console.error('СЛУЧИЛАСЬ КАКАЯ-ТО ХУЙНЯ ПРИ СОХРАНЕНИИ ГЕНЕРАЛОБЖЕКТ: ', err);
    }
};
module.exports = saveGeneralInfo;


