const browser = require("./browser");
const scraper = require("./scraper");

let browserObj = browser.startBrowser();

async function scrapeAll(browserObj) {
    let browser;
    try {
        browser = await browserObj;
        await scraper.scrape(browser);
        browser.close();
    } catch (err) {
        console.log("program exiting with error => ", err);
        browser.close();
    }
}

scrapeAll(browserObj)