const { doesNotMatch } = require('assert');
const fs = require('fs');
const { format } = require('path');

let url = 'https://connect.biorxiv.org/relate/content/181?page=';
var writeEmails = fs.createWriteStream('output/biorxiv-emails.txt', {flags: 'w'});

async function scrape(browser, pageNum) {
    let page = await browser.newPage();

    let tempUrl = url + pageNum;
    console.log(`Navigating to ${tempUrl} ...`);
    await page.goto(tempUrl);

    // content block that holds all the articles on the page
    await page.waitForSelector('#block-system-main');

    // get a list of links to the articles on the current page
    let urls = await page.$$eval('.highwire-cite-metadata-journal > a', links => {
        return links.map(a => a.href)
    });

    for (const link of urls) {
        try{
            console.log("scraping " + link)
            let article = await browser.newPage();
            let authorLink = link+".article-info";
    
            await article.goto(authorLink);
    
            await article.waitForSelector('.pane-content');
    
            // get the corresponding author email for the article
            let email = await article.$eval('.em-addr', email => {
                return email.textContent;
            });
    
            let formatEmail = email.replace('{at}', '@');
            writeEmails.write(formatEmail + `\n`);

            article.close();
        } catch(ex) {
            console.log(ex);
        }
    }
    console.log("done" + `\n`);
}

module.exports = {
    scrape
}