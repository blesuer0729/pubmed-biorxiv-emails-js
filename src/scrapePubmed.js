const { doesNotMatch } = require('assert');
const fs = require('fs');
const { format } = require('path');

async function scrape(browser, pageNum) {
    let url = 'https://pubmed.ncbi.nlm.nih.gov/?term=covid-19&page=';
    let writeEmails = fs.createWriteStream('output/pubmed-emails.txt', {flags: 'w'});

    let page = await browser.newPage();

    let tempUrl = url + pageNum;
    console.log(`Navigating to ${tempUrl} ...`);
    await page.goto(tempUrl);

    // content block that holds all the articles on the page
    await page.waitForSelector('#search-results');

    // get a list of links to the articles on the current page
    let urls = await page.$$eval('.docsum-title', links => {
        return links.map(link => link.href)
    });

    for (const link of urls) {
        try {
            console.log("scraping " + link)

            // article is the page chromium will open each link in
            let article = await browser.newPage();
            await article.goto(link);

            let authorLink = await article.$eval('[data-ga-action=PMCID]', pmcid => {
                return pmcid.href;
            });
            let metaArticle = await browser.newPage();
            await metaArticle.goto(authorLink);

            // sometimes an article can contain author information without an email
            let email = await metaArticle.evaluate(() => {
                const el = document.querySelector('.oemail');
                if (el) {
                    // author emails are in reverse in the page source
                    return el.textContent.split("").reverse().join("");
                } else {
                    return 'Author information does not contain an email...';
                }
            })

            let name = await metaArticle.evaluate(() => {
                const el = document.querySelector('meta[name="DC.Contributor"]');
                if (el) {
                    return el.content;
                } else {
                    return 'Author information could not identify the full name of the contributor';
                }
            });

            writeEmails.write(email + ' ' + name + `\n`);

            metaArticle.close();
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