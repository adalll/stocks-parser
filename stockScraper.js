const puppeteer = require('puppeteer');
const fs = require('fs');
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

const stockScraper = async (stockURL, stockId) => {

    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);

    let stockObject = {};

    try {

        await page.goto(stockURL, PAGE_PUPPETEER_OPTS);
        await page.setViewport({ width: 1200, height: 800 });

        const investingObject = await page.evaluate((stockURL, stockId) => {

            const stockNameSelector = '#leftColumn > div.instrumentHead > h1';
            const currentPriceSelector = '#last_last';
            const PERatioSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(11) > span.float_lang_base_2.bold';
            const epsSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(6) > span.float_lang_base_2.bold';
            const marketCapSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(8) > span.float_lang_base_2.bold';
            const oneYearChangeSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(13) > span.float_lang_base_2.bold';
            const nextEarningsDateSelector = '#leftColumn > div.clear.overviewDataTable.overviewDataTableWithTooltip > div:nth-child(15) > span.float_lang_base_2.bold > a';
            const industrySelector = '#leftColumn > div.companyProfileHeader > div:nth-child(1) > a';
            const sectorSelector = '#leftColumn > div.companyProfileHeader > div:nth-child(2) > a';

            const stockName = document.querySelector(stockNameSelector) ? document.querySelector(stockNameSelector).innerText : '';
            const ticker = stockName.match('\\((.*)\\)');
            const company = stockName.replace(/ \(.*\)/g , "");

            const currentPrice = document.querySelector(currentPriceSelector) ? document.querySelector(currentPriceSelector)
                .innerText.replace(/,/g , "") : '';
            const peRatio = document.querySelector(PERatioSelector) ? document.querySelector(PERatioSelector).innerText : '';
            const eps = document.querySelector(epsSelector) ? document.querySelector(epsSelector).innerText : '';
            const marketCap = document.querySelector(marketCapSelector) ? document.querySelector(marketCapSelector).innerText : '';
            const oneYearChange = document.querySelector(oneYearChangeSelector) ? document.querySelector(oneYearChangeSelector).innerText : '';
            const nextEarningsDate = document.querySelector(nextEarningsDateSelector) ? document.querySelector(nextEarningsDateSelector).innerText : '';
            const industry = document.querySelector(industrySelector) ? document.querySelector(industrySelector).innerText : '';
            const sector = document.querySelector(sectorSelector) ? document.querySelector(sectorSelector).innerText : '';


            return {
                ticker: ticker ? ticker[1] : '',
                company: company ? company : '',
                investingCompanyURL: stockURL,
                investingCompanyId: stockId,
                currentPrice: currentPrice,
                peRatio: peRatio,
                eps: eps,
                marketCap: marketCap,
                oneYearChange: oneYearChange,
                nextEarningsDate: nextEarningsDate,
                industry: industry,
                sector: sector,
                lastUpdated: Date.now(),
            };
        }, stockURL, stockId);

        await page.goto(URLS.dividendURL, PAGE_PUPPETEER_OPTS);
        await page.setViewport({ width: 1200, height: 800 });

        await page.type('#sponsored-search-typeahead', investingObject.ticker);
        await page.click('body > header.n-header.t-w-full.t-container.t-mx-auto > div.t-flex.t-items-center > section > form > button');

        await page.waitForNavigation({timeout: 5000}).catch(() =>
            console.log('CANT OPEN DIVIDEND PAGE FOR COMPANY')
        );

        const dividendObject = await page.evaluate(() => {

            const dividendYieldSelector = '#stock-dividend-data > section > div:nth-child(1) > p';
            const annualizedPayoutSelector = '#stock-dividend-data > section > div:nth-child(2) > p';
            const payoutRatioSelector = '#stock-dividend-data > section > div:nth-child(4) > p';
            const dividendGrowthSelector = '#stock-dividend-data > section > div:nth-child(5) > p';

            const dividendYield = document.querySelector(dividendYieldSelector) ? document.querySelector(dividendYieldSelector).innerText : '';
            const annualizedPayout = document.querySelector(annualizedPayoutSelector) ? document.querySelector(annualizedPayoutSelector).innerText : '';
            const payoutRatio = document.querySelector(payoutRatioSelector) ? document.querySelector(payoutRatioSelector).innerText : '';
            const dividendGrowth = document.querySelector(dividendGrowthSelector) ? document.querySelector(dividendGrowthSelector).innerText : '';


            return {
                dividendYield: dividendYield,
                annualizedPayout: annualizedPayout,
                payoutRatio: payoutRatio,
                dividendGrowth: dividendGrowth,
            };
        });


        await page.goto('https://www.tinkoff.ru/invest/stocks/' + investingObject.ticker, PAGE_PUPPETEER_OPTS);
        await page.setViewport({ width: 1200, height: 800 });

        //await page.type('body > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > input', investingObject.company);
        //await page.keyboard.press('Enter');
        await page.waitForNavigation({timeout: 5000}).catch(() =>
            console.log('CANT OPEN TINKOFF PAGE FOR COMPANY')
        );

        const tinkoffObject = await page.evaluate(() => {

            const logoSelector = 'body > div.application > div > div > div > div.PortalContainer__container_1jUdq > div.UILayoutPage__page_1gFPc > div:nth-child(1) > div.PlatformLayout__layoutPageComponent_M16bJ > div > div > div > div > div > div > div > div > div > div > span';

            let logoLink = document.querySelector(logoSelector) ? document.querySelector(logoSelector).style.backgroundImage : '';

            if (logoLink) { logoLink = 'http://' + logoLink.match(/\("\/\/(.*)"\)/)[1];}

            return {
                logoLink: logoLink,
            };
        });


        var viewSource = await page.goto(tinkoffObject.logoLink);
        await fs.writeFile("./logos/" + investingObject.ticker + ".png", await viewSource.buffer(), function(err) {
            if(err) {
                return console.log('SAVING LOGO FAILED: ', err);
            }
            console.log("LOGO SAVED SUCCESSFULLY!");
        });


        stockObject = {...investingObject, ...dividendObject, ...tinkoffObject};

    } catch (err) {
        console.log('STOCK SCRAPPING ERROR: ', err);
    }
    browser.close();
    console.log(stockObject);

    return await stockObject;
};
module.exports = stockScraper;
