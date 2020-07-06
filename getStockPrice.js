module.exports = {
    scrapeStock: async function(stock){
        const puppeteer = require('puppeteer-extra');
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        puppeteer.use(StealthPlugin());

        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.goto('https://finance.yahoo.com/quote/' + stock);
        try{
            var xPath = '//*[@id="quote-header-info"]/div[3]/div/div/span[1]';
            await page.waitForSelector('#consent-page > div > div > div > div.wizard-footer > div > form > button.btn.primary');
            const form = await page.$('#consent-page > div > div > div > div.wizard-footer > div > form > button.btn.primary');
            await form.evaluate( form => form.click() );

            await page.waitForXPath(xPath);
            const [el] = await page.$x(xPath);
            const src = await el.getProperty('innerText');
            const srcTxt = await src.jsonValue();

            var srcCount = await el.getProperty('childElementCount');
            srcCount = await src.jsonValue();

            var i = 0;
            var result = '';
            for(i in srcTxt){
                result += Object.values(srcTxt)[i];
            }

            return result;
        }   catch(err){
            console.log(err);
        }
    }
};


