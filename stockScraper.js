const puppeteer = require('puppeteer');
const URLS = require('./data/URLS');

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
        // "--proxy-server=socks5://127.0.0.1:9999"
    ]
};
const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 0
};

const stockScraper = async (stockURL) => {

    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();
    const page2 = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page2.setDefaultNavigationTimeout(0);

    let stockObject = {};

    try {

        await page.goto(stockURL, PAGE_PUPPETEER_OPTS);
        await page.setViewport({ width: 1200, height: 800 });

        await page2.goto(URLS.dividendURL, PAGE_PUPPETEER_OPTS);
        await page2.setViewport({ width: 1200, height: 800 });


        investingObject = await page.evaluate(() => {

            const stockNameSelector = '#leftColumn > div.instrumentHead > h1';
            const currentPriceSelector = '#last_last';
            const PERatioSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(11) > span.float_lang_base_2.bold';
            const epsSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(6) > span.float_lang_base_2.bold';
            const marketCapSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(8) > span.float_lang_base_2.bold';
            const oneYearChangeSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(13) > span.float_lang_base_2.bold';
            const nextEarningsDateSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(15) > span.float_lang_base_2.bold > a';

            const stockName = document.querySelector(stockNameSelector) ? document.querySelector(stockNameSelector).innerText : '';
            const ticker = stockName.match('\\((.*)\\)');
            const company = stockName.replace(/ \(.*\)/g , "");

            const currentPrice = document.querySelector(currentPriceSelector) ? document.querySelector(currentPriceSelector).innerText : '';
            const peRatio = document.querySelector(PERatioSelector) ? document.querySelector(PERatioSelector).innerText : '';
            const eps = document.querySelector(epsSelector) ? document.querySelector(epsSelector).innerText : '';
            const marketCap = document.querySelector(marketCapSelector) ? document.querySelector(marketCapSelector).innerText : '';
            const oneYearChange = document.querySelector(oneYearChangeSelector) ? document.querySelector(oneYearChangeSelector).innerText : '';
            const nextEarningsDate = document.querySelector(nextEarningsDateSelector) ? document.querySelector(nextEarningsDateSelector).innerText : '';

            return {
                ticker: ticker ? ticker[1] : '',
                company: company ? company : '',
                currentPrice: currentPrice,
                peRatio: peRatio,
                eps: eps,
                marketCap: marketCap,
                oneYearChange: oneYearChange,
                nextEarningsDate: nextEarningsDate,
                lastUpdated: Date.now(),
            };
        });

        //await page.goto(URLS.dividendURL, PAGE_PUPPETEER_OPTS);
        //await page.setViewport({ width: 1200, height: 800 });

        await page2.type('#sponsored-search-typeahead', investingObject.ticker);
        await page2.click('body > header.n-header.t-w-full.t-container.t-mx-auto > div.t-flex.t-items-center > section > form > button');

        await page2.waitForNavigation();

        dividendObject = await page2.evaluate(() => {

            const dividendYieldSelector = '#stock-dividend-data > section > div:nth-child(1) > p';
            const annualizedPayoutSelector = '#stock-dividend-data > section > div:nth-child(2) > p';
            const payoutRatioSelector = '#stock-dividend-data > section > div:nth-child(4) > p';
            const dividendGrowthSelector = '#stock-dividend-data > section > div:nth-child(5) > p';

            const dividendYield = document.querySelector(dividendYieldSelector).innerText;
            const annualizedPayout = document.querySelector(annualizedPayoutSelector).innerText;
            const payoutRatio = document.querySelector(payoutRatioSelector).innerText;
            const dividendGrowth = document.querySelector(dividendGrowthSelector).innerText;

            return {
                dividendYield: dividendYield ? dividendYield : '',
                annualizedPayout: annualizedPayout ? annualizedPayout : '',
                payoutRatio: payoutRatio ? payoutRatio : '' ,
                dividendGrowth: dividendGrowth ? dividendGrowth : '',
            };
        });

        stockObject = {...investingObject, ...dividendObject};

    } catch (err) {
        console.log('СЛУЧИЛАСЬ КАКАЯ-ТО ХУЙНЯ ПРИ СКРАПИНГЕ СТОКА: ', err);
    }
    browser.close();
    console.log(stockObject);

    return await stockObject;
};
module.exports = stockScraper;
