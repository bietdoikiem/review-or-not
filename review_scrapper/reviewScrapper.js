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
  "https://shopee.sg/Baby-Educational-Soft-Rubber-Hand-Grasp-Rolling-Ball-Crib-Mobile-Bell-Toy-i.87219179.2128867533";



  (async () => {
  const browser = await puppeteer.launch({headless: false});
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
     await wait(2000);
     viewportIncr = viewportIncr + viewportHeight;
   }
 
   // Scroll back to to
   // Some extra delay to let images load

    await page.waitForTimeout(2000);
    await navigationPromise;

    const reviews = await page.evaluate(() => {

      let results = []

      let items = document.getElementsByClassName("shopee-product-rating__content")
      for (let elem of items) {
        let review = {} // Review object
        review['content'] = elem.innerText // Add review content
        results.push(review); // Add to the result list
      }
      return (results)
    })
    console.log(reviews)


    await browser.close();
  })()


