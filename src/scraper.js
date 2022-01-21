let url = 'https://connect.biorxiv.org/relate/content/181';

async function scrape(browser) {
    let page = await browser.newPage();

    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    // content block that holds all the articles on the page
    await page.waitForSelector('#block-system-main');

    // get a list of links to the articles on the current page
    let urls = await page.$$eval('.highwire-cite-metadata-journal > a', links => {
        return links.map(a => a.href)
    });
    
    urls.forEach(link => {
        openNewArticle(browser, link);
    })
}

// open each page for a given article
async function openNewArticle(browser, link) {
    try{
        let article = await browser.newPage();
        let authorLink = link+".article-info";

        console.log("opening " + authorLink + "...")
        await article.goto(authorLink);

        await article.waitForSelector('.pane-content');

        // get the corresponding author email for the article
        let email = await article.$eval('.em-addr', email => {
            return email.textContent;
        });

        let formatEmail = email.replace('{at}', '@');
        console.log(formatEmail);
    } catch(ex) {
        console.log(ex);
    }
}

module.exports = {
    scrape
}