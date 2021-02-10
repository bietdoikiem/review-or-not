const puppeteer = require("puppeteer");

const searchDetails = async (searchQuery) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(searchQuery);

    // Pause the function for 6s
    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    await sleep(6000);

    // Click the "I AM OVER 18" if the dialog shows in the page
    if ((await page.$(".shopee-alert-popup__message")) !== null)
        await page.click(".shopee-alert-popup__btn");  
      
    // Array to hold all our results
    let dataObj = {};

    // Take each element and store it
    // Title
    dataObj["title"] = await page.$eval("._3ZV7fL > span",(text) => text.textContent);

    // URL image
    dataObj["imageUrl"] = await page.$eval("._39-Tsj > div", (div) => div.getAttribute("style").substring(23, div.getAttribute("style").indexOf(")") - 1));

    // Rating - 2 conditions to check if there are ratings or not
    if (await page.$("._3WXigY") !== null) {
        dataObj["rating"] = await page.$eval("._3WXigY",(text) => text.textContent);
    } else dataObj["rating"] = "No Ratings Yet";
          
    // Price
    dataObj["price"] = await page.$eval( ".AJyN7v",(text) => text.textContent);
    
    // Description
    dataObj["description"] = await page.$eval("._36_A1j > span",(text) => text.textContent);

    await browser.close();
    return dataObj;
};

module.exports = searchDetails;