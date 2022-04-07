#!/usr/bin/env node
const prompt = require('prompt');
const browser = require("../src/browser");
const scraper = require("../src/index");

prompt.start();

prompt.get(['site', 'start', 'stop'], function (err, result) {
    let browserObj = browser.startBrowser();
    scraper.scrapeAll(browserObj, result.site, result.start, result.stop);
});