const chalk = require('chalk');

const puppeteer = require('puppeteer');
const LAUNCH_PUPPETEER_OPTS = {
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--proxy-server=socks5://127.0.0.1:9999'
    ]
};
const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 0
};

const reviewScraping = async (profilesList, pageURL) => {
    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'image')
            request.abort();
        else
            request.continue();
    });

    await page.setDefaultNavigationTimeout(0);

    let allReviewsArray = [];

    try {
        await page.goto(pageURL, PAGE_PUPPETEER_OPTS);

        //await page.click('[href="#"]');???
        const enter = await page.$('[href="#"]');
        await enter.click();
        await page.setViewport({ width: 1200, height: 800 });


        for (let i = 0; i < profilesList.profilesLinks.length; i++ ) {
            const profileURL = profilesList.profilesLinks[i];

            let evaluationURL = pageURL + '/evaluations/' + profileURL.replace(/(\/escort\/)/g, "");

            await page.goto(evaluationURL + '?ln=en');

            await page.select('#perpage', 'all');

            // Ждем пока не исчезнет пагинация (прогрузится аякс)
            await page.waitFor(() => !document.querySelector('#setcard > div.rcol > div.ajax > p'));

            const evaluationResult = await page.evaluate((profileURL) => {

                let profileReviewsArray = [];

                const meetingDateSelector = '#setcard > div.rcol > div.ajax > table> tbody > tr > td:nth-child(1)';
                const memberInfoSelector = '#setcard > div.rcol > div.ajax > table> tbody > tr > td:nth-child(2) > a';
                const memberAmountsSelector = '#setcard > div.rcol > div.ajax > table> tbody > tr > td:nth-child(2) > p';
                const citySelector = '#setcard > div.rcol > div.ajax > table > tbody > tr > td:nth-child(3)';
                const placeSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(3) > tbody > tr:nth-child(1) > td';
                const durationSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(3) > tbody > tr:nth-child(2) > td';
                const unitsSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(3) > tbody > tr:nth-child(3) > td';
                const looksSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(5) > tbody > tr:nth-child(1) > td';
                const massageSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(5) > tbody > tr:nth-child(2) > td';
                const ratioSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(5) > tbody > tr:nth-child(3) > td';
                const ratingSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(5) > tbody > tr:nth-child(4) > td';
                const massageDetailsSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(6) > tbody > tr:nth-child(1) > td';
                const extraballSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(6) > tbody > tr:nth-child(2) > td';
                const breastSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(6) > tbody > tr:nth-child(3) > td';
                const attitudeSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(6) > tbody > tr:nth-child(4) > td';
                const conversationSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(6) > tbody > tr:nth-child(5) > td';
                const availabilitySelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(6) > tbody > tr:nth-child(6) > td';
                const photosSelector = '#setcard > div.rcol > div.ajax > div > table:nth-child(6) > tbody > tr:nth-child(7) > td';
                const reviewContentSelector = '#setcard > div.rcol > div.ajax > div > p';

                const meetingDateArray = Array.from(document.querySelectorAll(meetingDateSelector)).map(item => item.innerText);
                const memberNameURLArray = Array.from(document.querySelectorAll(memberInfoSelector))
                    .map(item => {
                        return {
                            username: item.innerText,
                            userURL: item.href
                        }
                    });
                const memberAmountsArray = Array.from(document.querySelectorAll(memberAmountsSelector))
                    .map(item => {
                        return {
                            reviewsAmount: item.innerText.match('\\d{1,}(?= Reviews)'),
                            commentsAmount: item.innerText.match('\\d{1,}(?= Comments)')                        }
                    });
                const cityArray = Array.from(document.querySelectorAll(citySelector)).map(item => item.innerText);
                const placeArray = Array.from(document.querySelectorAll(placeSelector)).map(item => item.innerText);
                const durationArray = Array.from(document.querySelectorAll(durationSelector)).map(item => item.innerText);
                const unitsArray = Array.from(document.querySelectorAll(unitsSelector)).map(item => item.innerText);
                const looksArray = Array.from(document.querySelectorAll(looksSelector)).map(item => item.innerText);
                const massageArray = Array.from(document.querySelectorAll(massageSelector)).map(item => item.innerText);
                const ratioArray = Array.from(document.querySelectorAll(ratioSelector)).map(item => item.innerText);
                const ratingArray = Array.from(document.querySelectorAll(ratingSelector)).map(item => item.innerText);
                const massageDetailsArray = Array.from(document.querySelectorAll(massageDetailsSelector)).map(item => item.innerText);
                const extraballArray = Array.from(document.querySelectorAll(extraballSelector)).map(item => item.innerText);
                const breastArray = Array.from(document.querySelectorAll(breastSelector)).map(item => item.innerText);
                const attitudeArray = Array.from(document.querySelectorAll(attitudeSelector)).map(item => item.innerText);
                const conversationArray = Array.from(document.querySelectorAll(conversationSelector)).map(item => item.innerText);
                const availabilityArray = Array.from(document.querySelectorAll(availabilitySelector)).map(item => item.innerText);
                const photosArray = Array.from(document.querySelectorAll(photosSelector)).map(item => item.innerText);
                const reviewContentArray = Array.from(document.querySelectorAll(reviewContentSelector)).map(item => item.innerText);

                for (let i = 0; i < meetingDateArray.length; i++ ) {
                    profileReviewsArray.push({
                        profileURL: profileURL.replace(/(\/escort\/)/g, ""),
                        meetingDateArray: meetingDateArray[i] ? meetingDateArray[i] : '',
                        member: {
                            username: memberNameURLArray[i].username ? memberNameURLArray[i].username : '',
                            userURL: memberNameURLArray[i].userURL ? memberNameURLArray[i].userURL : '',
                            reviewsAmount: memberAmountsArray[i].reviewsAmount ? memberAmountsArray[i].reviewsAmount[0] :  0,
                            commentsAmount: memberAmountsArray[i].commentsAmount ? memberAmountsArray[i].commentsAmount[0] :  0
                        },
                        city: cityArray[i] ? cityArray[i] : '',
                        place: placeArray[i] ? placeArray[i]: '',
                        duration: {
                            amount: durationArray[i] ? durationArray[i] : '',
                            units: unitsArray[i] ? unitsArray[i].replace(/\s/g, '') : ''
                        },
                        rates: {
                            looks: looksArray[i] ? looksArray[i] : '',
                            massage: massageArray[i] ? massageArray[i] : '',
                            ratio: ratioArray[i] ? ratioArray[i] : '',
                            rating: ratingArray[i] ? ratingArray[i] : ''
                        },
                        reviewDetails: {
                            massage: massageDetailsArray[i] ? massageDetailsArray[i] : '',
                            extraball: extraballArray[i] ? extraballArray[i] : '',
                            breast: breastArray[i] ? breastArray[i] : '',
                            attitude: attitudeArray[i] ? attitudeArray[i] : '',
                            conversation: conversationArray[i] ? conversationArray[i] : '',
                            availability: availabilityArray[i] ? availabilityArray[i] : '',
                            photos: photosArray[i] ? photosArray[i] : ''
                        },
                        reviewContent: reviewContentArray[i] ? reviewContentArray[i] : ''
                    });
                }
                return profileReviewsArray;
            }, profileURL); //конец формирования массива для одного профиля

            console.log(`Ревью по профайлу: ${profileURL} `, evaluationResult);
            //складываем все ревью всех профайлов в один массив
            allReviewsArray = allReviewsArray.concat(evaluationResult);

        } //конец фора по профайлам

    } catch (err) {
        console.log(chalk.red('An error has occured \n'));
        console.log(err);
    }
    browser.close();
    console.log('Все ревью всех анкет: ', allReviewsArray);
    return allReviewsArray;
};
module.exports = reviewScraping;
