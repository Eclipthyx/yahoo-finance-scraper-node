module.exports = {
    scrapeContracts: async function(stock){
        const puppeteer = require('puppeteer-extra');
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        puppeteer.use(StealthPlugin());

        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.goto('https://finance.yahoo.com/quote/' + stock + '/options/');
        try
        {
            //Contract strike
            var xPath1 = '//*[@id="Col1-1-OptionContracts-Proxy"]/section/section[1]/div[2]/div/table/tbody/tr[1]/td[3]/a';
            //Contract price
            var xPath2 = '//*[@id="Col1-1-OptionContracts-Proxy"]/section/section[1]/div[2]/div/table/tbody/tr[1]/td[4]';//td[4] last price; td[6] ask price
            //Contract list
            var xPath3 = '//*[@id="Col1-1-OptionContracts-Proxy"]/section/section[1]/div[2]/div/table/tbody';

            //Agree with cookies
            await page.waitForSelector('#consent-page > div > div > div > div.wizard-footer > div > form > button.btn.primary');
            const form = await page.$('#consent-page > div > div > div > div.wizard-footer > div > form > button.btn.primary');
            await form.evaluate( form => form.click() );

            //Wait for contracts to load
            await page.waitForXPath(xPath1);
            await page.waitForXPath(xPath2);

            //Iterate through every available contract
            const [elRow] = await page.$x(xPath3);
            const srcRow = await elRow.getProperty('children');
            const srcTxtRow = await srcRow.jsonValue();

            var arrayStrike = new Array();
            var arrayPrice = new Array();
            var result = new Array();
            var count = 0;
            for(let i in srcTxtRow)
            {
                count++;
                //Contract Strike
                {
                    xPath1Foo = '//*[@id="Col1-1-OptionContracts-Proxy"]/section/section[1]/div[2]/div/table/tbody/tr[';
                    xPath1Bar = ']/td[3]/a';
                    const [el] = await page.$x(xPath1Foo + count + xPath1Bar);
                    const src = await el.getProperty('innerText');
                    const srcTxt = await src.jsonValue();

                    var strike = '';
                    for(let i in srcTxt)
                    {
                        strike += Object.values(srcTxt)[i];
                    }
                }

                //Contract Price
                {
                    xPath2Foo = '//*[@id="Col1-1-OptionContracts-Proxy"]/section/section[1]/div[2]/div/table/tbody/tr[';
                    //td[4] last price; td[6] ask price
                    xPath2Bar = ']/td[4]';
                    const [el] = await page.$x(xPath2Foo + count + xPath2Bar);
                    const src = await el.getProperty('innerText');
                    const srcTxt = await src.jsonValue();

                    var price = '';
                    for(let i in srcTxt)
                    {
                        price += Object.values(srcTxt)[i];
                    }
                }
                //Add count to result to add contract number
                arrayStrike[i] = strike;
                arrayPrice[i] = price;
            }
            result[0] = arrayStrike;
            result[1] = arrayPrice;
            
            return result;
        }   catch(err){
            console.log(err);
        }
    }
};


