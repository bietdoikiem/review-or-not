const fs = require("fs");

const url =
  "https://shopee.sg/Baby-Educational-Soft-Rubber-Hand-Grasp-Rolling-Ball-Crib-Mobile-Bell-Toy-i.87219179.2128867533";
const scraperObject = {
  url: url,
    async scraper(browser) {
      let page = await browser.newPage();
      await page.goto(this.url);
      let scrapedData = [];

      // Get the relevant data from the product
      let pagePromise = () =>
        new Promise(async (resolve) => {
          // Store scraped data
          let dataObj = {};

          // Take each element and store it
          // Title
          dataObj["title"] = await page.$eval(
            "._3ZV7fL > span",
            (text) => text.textContent
          );

          // URL's image
          dataObj["imageUrl"] = await page.$eval("._39-Tsj > div", (div) =>
            div
              .getAttribute("style")
              .substring(23, div.getAttribute("style").indexOf(")")-1)
          );

          // Rating - 2 conditions to check if there are ratings or not
          if ((await page.$("._3WXigY")) !== null) {
            dataObj["rating"] = await page.$eval(
              "._3WXigY",
              (text) => text.textContent
            );
          } else dataObj["rating"] = "No Ratings Yet";

          // Price
          dataObj["price"] = await page.$eval(
            ".AJyN7v",
            (text) => text.textContent
          );

          // Description
          dataObj["description"] = await page.$eval(
            "._36_A1j > span",
            (text) => text.textContent
          );
          resolve(dataObj);
          await page.close(); // Close the browser
        });

      // Pause the function for 5s
      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      await sleep(5000);
      
      // Store data scraped into a variable
      let currentPageData = await pagePromise(url);
      scrapedData.push(currentPageData);
      console.log(scrapedData);

      // Save data scraped into json file
      fs.writeFile(
        "data.json",
        JSON.stringify(scrapedData),
        "utf8",
        function (err) {
          if (err) {
            return console.log(err);
          }
          console.log(
            "The data has been scraped and saved successfully! View it at './data.json'"
          );
        }
      );
    },
};

module.exports = scraperObject;
