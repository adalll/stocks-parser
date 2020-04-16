const URLS = require('./data/URLS');
const CronJob = require('cron').CronJob;
const profilesGeneralInfo = require('./generalInfoScraper');
const saveGeneralInfo = require('./saveGeneralInfo');
const stockScraper = require('./stockScraper');
const compareAndSaveProfile = require('./compareAndSaveProfile');
const mongoose = require('mongoose');


const startTime = Date.now();
let startCompanyTime = Date.now();


mongoose.connect('mongodb+srv://stockUser:stockUser1617@stocks-qywnv.mongodb.net/stockDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('CONNECTED TO MOBGODB OK');

        console.log('START PARSING...');
        profilesGeneralInfo(URLS.investingURL)
            .then(async (generalInfoObject) => {
                console.log('GENERAL INFO PARSING TIME: ', (Date.now() - startTime) / 1000, 's');
                await saveGeneralInfo(generalInfoObject);
                for (let i = 0; i < 5/*generalInfoObject.stocksLinks.length*/; i++) {
                    startCompanyTime = Date.now();
                    const profileObject  = await stockScraper(generalInfoObject.stocksLinks[i]);
                    await compareAndSaveProfile(profileObject);
                    console.log('LAST COMPANY PARSING & SAVING TIME: ', (Date.now() - startCompanyTime) / 1000, 's');
                }
                console.log('TOTAL TIME: ', (Date.now() - startTime) / 1000, 's');
            })
            .catch(console.error);
    })
    .catch(() => {
        console.log('CONNECTION TO MOBGODB FAILED');
    }).then(() => mongoose.disconnect);

//const job = new CronJob(`${Math.floor(Math.random() * Math.floor(59))} */6 * * *`, () => {
  /*  profilesGeneralInfo(mobilePageURL)
        .then(async (generalInfoObject) => {
            await saveGeneralInfo(generalInfoObject);
            for (let i = 0; i < generalInfoObject.profilesIDs.length; i++) {
                const profileObject  = await profilesScraper(generalInfoObject.profilesIDs[i], pageURL);
                await compareAndSaveProfile(profileObject);
            }
        })
        .catch(console.error);
//});
//job.start();*/

//profilesGeneralInfo(investingURL);

//});
