const fs = require("fs");
const puppeteer = require('puppeteer');


async function getElText(page, selector) {
	return await page.evaluate((selector) => {
		return document.querySelector(selector).innerText
	}, selector);
}

function wait (ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

const url =
  "https://shopee.sg/Giordano-Men-Oxford-Embroidery-Frog-Shirt-i.309959293.4361425059";



  (async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  const navigationPromise = page.waitForNavigation();

  await page.goto(url, {waitUntil: 'load'});

   const bodyHandle = await page.$('body');
   const { height } = await bodyHandle.boundingBox();
   await bodyHandle.dispose();


   // Dealing with lazy loading
   const viewportHeight = page.viewport().height;
   let viewportIncr = 0;
   while (viewportIncr + viewportHeight < height) {
     await page.evaluate(_viewportHeight => {
       window.scrollBy(0, _viewportHeight);
     }, viewportHeight);
     await wait(1000);
     viewportIncr = viewportIncr + viewportHeight;
   }
 
   // Scroll back to to
   // Some extra delay to let images load

    await page.waitForTimeout(1000);
    await navigationPromise;

    const reviews = await page.evaluate( async () => {

      function wait (ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
      }

      let results = []

      let pages = document.getElementsByClassName("shopee-icon-button--right")

      let trackingPage = 1;
      let nextPage = 1;
      // Condition checking if there are reviews for the product
      while (trackingPage == nextPage && pages[0] != undefined){


        // Scrape review's star
        let reviewStar = document.getElementsByClassName("shopee-product-rating__rating")
      

        // Scrape review's content
        let items = document.getElementsByClassName("shopee-product-rating")
        for (let elem of items) {
          let review = {} // Review object
          let userReview =  elem.getElementsByClassName("shopee-product-rating__main")[0]
          review['content'] = userReview.getElementsByClassName("shopee-product-rating__content")[0].innerText // Add review content
          review['rating'] = userReview.getElementsByClassName("icon-rating-solid--active").length
          results.push(review); // Add to the result list
        }

        await pages[0].click()
        trackingPage = parseInt(document.getElementsByClassName("shopee-button-solid shopee-button-solid--primary")[0].innerText)
        nextPage++;
        await wait(500)
        pages = null
        pages = document.getElementsByClassName("shopee-icon-button--right")
      }

     
      
      
      return (results)
    })
    console.log(reviews)


    await browser.close();
  })()


