class PuppeteerManager {
  /* initialize */
  constructor({ url, commands, nrOfPages }) {
    this.url = url;
    this.existingCommands = commands; // instructions on DOM
    this.nrOfPages = nrOfPages;
    this.allProducts = [];
    this.productDetails = {};
    this.productReviews = [];
  }

  async runPuppeteer() {
    const puppeteer = require("puppeteer");
    let commands = [];
    if (this.nrOfPages > 1) {
      for (let i = 0; i < this.nrOfPages; i++) {
        if (i < this.nrOfPages - 1) {
          commands.push(...this.existingCommands);
        } else {
          commands.push(this.existingCommands[0]);
        }
      }
    } else {
      commands = this.existingCommands;
    }
    // console.log("commands length", commands.length);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-gpu", "--start-maximized"],
    });
    let page = await browser.newPage();
    // await this.preparePageForTests(page);
    page.on("console", (msg) => {
      for (let i = 0; i < msg._args.lengths; ++i) {
        msg._args[i].jsonValue().then((result) => {
          console.log(result);
        });
      }
    });
    await page.goto(
      "https://shopee.sg/Giordano-Men-Oxford-Embroidery-Frog-Shirt-i.309959293.4361425059",
      { waitUntil: "load" }
    );

    const delay = 3000;
    let preCount = 0;
    let postCount = 0;
    // await page.screenshot({ path: "./screenshot2.jpg", type: "jpeg", fullPage: true });
    let timeout = 5000;
    let commandIndex = 0;
    while (commandIndex < commands.length) {
      try {
        console.log(`command ${commandIndex + 1}/${commands.length}`);
        let frames = await page.frames();

        /* Scroll event */
        const bodyHandle = await page.$("body");
        const { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();

        const viewportHeight = page.viewport().height;
        let viewportIncr = 0;
        while (viewportIncr + viewportHeight < height) {
          await page.evaluate((_viewportHeight) => {
            window.scrollBy(0, _viewportHeight);
          }, viewportHeight);
          await this.sleep(500);
          viewportIncr = viewportIncr + viewportHeight;
        }

        // await frames[0].waitForSelector(commands[commandIndex].locatorCss, { timeout: timeout });
        await this.sleep(100);

        await this.executeCommand(frames[0], commands[commandIndex]);
        // console.log(
        // 	"executing with locatorCss",
        // 	commands[commandIndex].locatorCss,
        // 	"and command type",
        // 	commands[commandIndex].type
        // ); /* test */
      } catch (error) {
        console.log(error);
        break;
      }
      commandIndex++;
    }
    console.log("done");
    // await browser.close();
  }

  async executeCommand(frame, command) {
    console.log(command.type, command.locatorCss);
    switch (command.type) {
      case "click":
        try {
          await frame.$eval(command.locatorCss, (elem) => elem.click());
          return true;
        } catch (error) {
          console.log("error", error);
          return false;
        }
      case "getItems":
        try {
          let products = await frame
            .evaluate((command) => {
              try {
                let parsedItems = [];
                let items = document.querySelectorAll(command.locatorCss);
                items.forEach(async (item) => {
                  let link =
                    "https://shopee.sg" +
                    item.querySelector("a").getAttribute("href");
                  let imageUrl = item
                    .querySelector("._39-Tsj._1tDEiO > img")
                    .getAttribute("src");
                  imageUrl = imageUrl ? imageUrl : "null";
                  let productTitle = item
                    .querySelector("._1NoI8_.A6gE1J._1co5xN")
                    .innerText.trim();
                  let price = item.querySelector("._1xk7ak").innerText.trim();
                  let product = {
                    productTitle: productTitle,
                    price: parseFloat(price),
                    link: link,
                    imageUrl: imageUrl,
                  };
                  console.log(product);
                  parsedItems.push(product);
                });
                return parsedItems;
              } catch (error) {
                console.log(error);
              }
            }, command)
            .then((result) => {
              this.allProducts.push.apply(this.allProducts, result);
              console.log("allProducts length", this.allProducts.length);
            });
          return true;
        } catch (error) {
          console.log("error", error);
          return false;
        }
      case "getItemDetails":
        try {
          this.productReviews = await frame.evaluate(async (command) => {
            console.log(command.locatorCss);

            try {
              function wait(ms) {
                return new Promise((resolve) =>
                  setTimeout(() => resolve(), ms)
                );
              }
              let results = [];

              let pages = document.getElementsByClassName(
                "shopee-icon-button--right"
              );

              let trackingPage = 1;
              let nextPage = 1;
              // Condition checking if there are reviews for the product
              while (trackingPage == nextPage && pages[0] != undefined) {
                // Scrape review's content
                let items = document.querySelectorAll(command.locatorCss);
                for (let elem of items) {
                  let review = {}; // Review object
                  let userReview = elem.getElementsByClassName(
                    "shopee-product-rating__main"
                  )[0];
                  review["author"] = userReview.getElementsByClassName(
                    "shopee-product-rating__author-name"
                  )[0].innerText; // Add review author

                  //Check variation
                  let reviewVariation = userReview.getElementsByClassName(
                    "shopee-product-rating__variation"
                  )[0];
                  if (reviewVariation != undefined)
                    review["variation"] = reviewVariation.innerText.replace(
                      "Variation: ",
                      ""
                    ); // Add review variation
                  review["content"] = userReview.getElementsByClassName(
                    "shopee-product-rating__content"
                  )[0].innerText; // Add review content
                  review["rating"] = userReview.getElementsByClassName(
                    "icon-rating-solid--active"
                  ).length; // Add review rating
                  results.push(review); // Add to the result list
                }

                await pages[0].click();
                trackingPage = parseInt(
                  document.getElementsByClassName(
                    "shopee-button-solid shopee-button-solid--primary"
                  )[0].innerText
                );
                nextPage++;
                await wait(500);
                pages = null;
                pages = document.getElementsByClassName(
                  "shopee-icon-button--right"
                );
              }

              return results;
            } catch (error) {
              console.log(error);
              return error;
            }
          }, command);
          console.log(this.productReviews);
          return true;
        } catch (error) {
          console.log("error", error);
          return false;
        }
      default:
        console.log("error");
        break;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllProducts() {
    await this.runPuppeteer();
    return this.allProducts;
  }

  async getProductReviews() {
    await this.runPuppeteer();
    return this.productReviews;
  }
  // async preparePageForTests(page) {
  // 	// Pass the User-Agent Test.
  // 	const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
  // 	  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
  // 	await page.setUserAgent(userAgent);
  // }

  async getCount(page, locatorCss) {
    return await page.$$eval(locatorCss, (a) => a.length);
  }

  async scrollDown(page, locatorCss) {
    await page.$eval(`${locatorCss}:last-child`, (e) => {
      e.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    });
  }
}

module.exports = { PuppeteerManager };
