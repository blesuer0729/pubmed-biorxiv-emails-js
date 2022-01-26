const puppeteer = require('puppeteer');

async function startBrowser() {
    let browser;
    try {
        console.log("Creating browser instance....");
        browser = await puppeteer.launch({
            args: ["--disable-setuid-sandbox"],
            'headless': true,
            defaultViewport: null,
            args: ['--start-maximized']
        });
    } catch (err) {
        console.log("Browser instance failed with error => ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
}