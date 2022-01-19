let url = 'http://books.toscrape.com';

async function scrape(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    await page.waitForSelector('.page_inner');

    let urls = await page.$$eval('section ol > li', links => {
        links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In Stock");
        links = links.map(el => el.querySelector('h3 > a').href);
        return links;
    });
    console.log(urls);
}

module.exports = {
    scrape
}