const puppeteer = require('puppeteer');
const MARKET_INDEXES = require('./data/MARKET_INDEXES');


const LAUNCH_PUPPETEER_OPTS = {
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        //'--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/604.1"',
        // "--proxy-server=socks5://127.0.0.1:9999"
    ]
};
const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 0
};

let generalInfoObject = {};

const generalInfo = async investingURL => {
    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    try {
        await page.goto(investingURL, PAGE_PUPPETEER_OPTS);

        //await page.waitForSelector('#PromoteSignUpPopUp > div.right > i', {timeout: 0});

        await page.waitForSelector('#stocksFilter', {timeout: 0});
        await page.select('#stocksFilter', MARKET_INDEXES["S&P500"]).then(()=> {
        });

        //await page.waitFor(() => document.querySelector('#stocksFilter'));
        //await page.select('#stocksFilter', 'S&P 500');
       // await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.waitFor(3000);
        //await page.setViewport({ width: 1200, height: 800 });
        //
        // let cityLink, profilesLinksArray;
        // let profilesLinks = [];
        // let profilesInCities = [];
        //

        const stocksLinks = await page.evaluate(() => {
             const stocksLinksSelector = '#cross_rate_markets_stocks_1 > tbody > tr > td > a';
             return Array.from(document.querySelectorAll(stocksLinksSelector)).map(item => item.href);
        });

        //console.log(stocksLinks);
        console.log('LINKS SCRAPPED: ',stocksLinks.length);

        //console.log(stocksLinks);
        //#pair_8193 > td.bold.left.noWrap.elp.plusIconTd > a
        // for (let i = 0; i < citiesLinks.length; i++){
        //     cityLink = mobilePageURL + citiesLinks[i];
        //     await page.goto(cityLink);
        //     profilesLinksArray = await page.evaluate(() => {
        //         const cityNameSelector = '#path > span.strong';
        //         const cityName = document.querySelector(cityNameSelector).innerText;
        //         return {
        //             city: cityName,
        //             profilesLinks: Array.from(document.querySelectorAll('#city-page > div.escort-info.mt0 > div.list-wrapper > div > div.image > a')).map(item => item.pathname)
        //         }
        //     });
        //     for (let i = 0; i < profilesLinksArray.profilesLinks.length; i++) {
        //         profilesLinks.push(profilesLinksArray.profilesLinks[i]);
        //     }
        //     profilesInCities.push({
        //         city: profilesLinksArray.city,
        //         amount: profilesLinksArray.profilesLinks.length
        //     })
        // }
        //
        // let profilesIDs = Array.from(new Set(profilesLinks)).map(item => +item.replace(/(?!(?:\d+$))./g, ''));
        //
         generalInfoObject = {
             date: Date.now(),
             siteURL: 'https://www.investing.com/',
             siteName: 'Investing.com',
             stocksLinksQuantity: stocksLinks.length,
             stocksLinks: stocksLinks
        };
    } catch (err) {
        console.log('СЛУЧИЛАСЬ КАКАЯ-ТО ХУЙНЯ ПРИ СКРАПИНГЕ ГЕНЕРАЛОБЖЕКТ: ', err);
    }
    browser.close();
    return generalInfoObject;
};

module.exports = generalInfo;
