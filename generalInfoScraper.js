const puppeteer = require('puppeteer');


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

const generalInfo = async (investingURL, MARKET_INDEX) => {

    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    try {
        await page.goto(investingURL, PAGE_PUPPETEER_OPTS);

        await page.waitForSelector('#stocksFilter', {timeout: 0});
        await page.select('#stocksFilter', MARKET_INDEX);
        await page.waitFor(3000);

        const companies = await page.evaluate(() => {
             const companyLinksSelector = '#cross_rate_markets_stocks_1 > tbody > tr > td > a';
             const companyIdSelector = '#cross_rate_markets_stocks_1 > tbody > tr';
             return {
                 companyLinks: Array.from(document.querySelectorAll(companyLinksSelector)).map(item => item.href),
                 companyIds: Array.from(document.querySelectorAll(companyIdSelector)).map(item => item.id.match(/\d+/)[0]),
             };
        });

        console.log('LINKS SCRAPPED: ', companies.companyLinks.length);

         generalInfoObject = {
             date: Date.now(),
             siteURL: 'https://www.investing.com/',
             siteName: 'Investing.com',
             companyLinksQuantity: companies.companyLinks.length,
             companyLinks: companies.companyLinks,
             companyIds: companies.companyIds
        };
    } catch (err) {
        console.log('СЛУЧИЛАСЬ КАКАЯ-ТО ХУЙНЯ ПРИ СКРАПИНГЕ ГЕНЕРАЛОБЖЕКТ: ', err);
    }
    browser.close();
    return generalInfoObject;
};

module.exports = generalInfo;
