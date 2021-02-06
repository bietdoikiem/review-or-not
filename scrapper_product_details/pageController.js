const pageScraper = require("./pageScraper");
const fs = require("fs");
async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    // Call the scraper for different set of books to be scraped
    scrapedData = await pageScraper.scraper(browser);
    await browser.close();
            
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}
module.exports = (browserInstance) => scrapeAll(browserInstance);
