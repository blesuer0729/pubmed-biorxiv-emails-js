const { doesNotMatch } = require('assert');
const fs = require('fs');
const { format } = require('path');

async function scrape(browser, pageNum) {
    let url = 'https://connect.biorxiv.org/relate/content/181?page=';
    let writeEmails = fs.createWriteStream('./output/biorxiv-emails.txt', {flags: 'w'});
    
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
        try {
            console.log("scraping " + link)

            // article is the page chromium will open each link in
            let article = await browser.newPage();
            let authorLink = link+".article-info";

            await article.goto(authorLink);
            await article.waitForSelector('.pane-content');

            // the element with class .em-addr contains author emails on biorxiv articles
            let email = await article.$eval('.em-addr', email => {
                return email.textContent;
            });
            // the element with class .name contains author names on biorxiv articles
            let name = await article.$eval('.name', name => {
                return name.textContent;
            });
    
            writeEmails.write(email.replace('{at}', '@') + ' ' + name + `\n`);

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