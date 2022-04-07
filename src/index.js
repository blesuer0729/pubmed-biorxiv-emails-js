const scrapeBiorxiv = require("./scrapeBiorxiv");
const scrapePubmed = require("./scrapePubmed");

async function scrapeAll(browserObj, site, start, stop) {
    let browser;
    if (site == "biorxiv") {
        try {
            browser = await browserObj;
            for(i = start; i <= stop; i++) {
                await scrapeBiorxiv.scrape(browser, i);
            }
        } catch (err) {
            console.log("program exiting with error => ", err);
            browser.close();
        } 
        browser.close();
    } else if (site == "pubmed"){
        try {
            browser = await browserObj;
            for(i = start; i <= stop; i++) {
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

module.exports = {
    scrapeAll
}