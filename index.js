const URLS = require('./data/URLS');
const MARKET_INDEXES = require('./data/MARKET_INDEXES');

const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;

const generalInfoScraper = require('./generalInfoScraper');
const stockScraper = require('./stockScraper');
const saveGeneralInfo = require('./saveGeneralInfo');
const compareAndSaveProfile = require('./compareAndSaveProfile');


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

        generalInfoScraper(URLS.investingURL, MARKET_INDEXES["S&P500"])
            .then(async (generalInfoObject) => {

                console.log('GENERAL INFO PARSING TIME: ', (Date.now() - startTime) / 1000, 's');

                await saveGeneralInfo(generalInfoObject);

                for (let i = 0; i < generalInfoObject.companyLinks.length; i++) {
                    startCompanyTime = Date.now();
                    const profileObject  = await stockScraper(generalInfoObject.companyLinks[i], generalInfoObject.companyIds[i]);
                    await compareAndSaveProfile(profileObject);
                    console.log('LAST COMPANY PARSING & SAVING TIME: ', (Date.now() - startCompanyTime) / 1000, 's');
                    console.log('TOTAL PARSED: ', i+1);
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

//});
