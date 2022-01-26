const browser = require("./browser");
const scraper = require("./scraper");

const args = process.argv.slice(2);
let browserObj = browser.startBrowser();

async function scrapeAll(browserObj) {
    let browser;
    try {
        browser = await browserObj;
        for(i = args[0]; i <= args[1]; i++) {
            await scraper.scrape(browser, i);
        }
    } catch (err) {
        console.log("program exiting with error => ", err);
        browser.close();
    } 
    browser.close();
}

scrapeAll(browserObj);