const browser = require("./browser");
const scrapeBiorxiv = require("./scrapeBiorxiv");
const scrapePubmed = require("./scrapePubmed");

const args = process.argv.slice(2);
let browserObj = browser.startBrowser();

async function scrapeAll(browserObj) {
    let browser;
    if (args[0] == "biorxiv") {
        try {
            browser = await browserObj;
            for(i = args[1]; i <= args[2]; i++) {
                await scrapeBiorxiv.scrape(browser, i);
            }
        } catch (err) {
            console.log("program exiting with error => ", err);
            browser.close();
        } 
        browser.close();
    } else if (args[0] == "pubmed"){
        try {
            browser = await browserObj;
            for(i = args[1]; i <= args[2]; i++) {
                await scrapePubmed.scrape(browser, i);
            }
        } catch (err) {
            console.log("program exiting with error => ", err);
            browser.close();
        } 
        browser.close();
    } else {
        console.log("Err: argument \'" + args[0] + "\' supplied was not recognized as a site");
    }
    
}

scrapeAll(browserObj);