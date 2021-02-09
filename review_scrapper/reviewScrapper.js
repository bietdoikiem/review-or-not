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
  "https://shopee.sg/Rigorer-Pro-Performance-Short-Sleeve-Compression-T-Shirt-SC0602-(Sports-Top-Gym-Fitness-Exercise-Cycling-Running)-i.106407924.4046257393";



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
      while (trackingPage == nextPage && pages[0] != undefined){
        let items = document.getElementsByClassName("shopee-product-rating__content")
        for (let elem of items) {
          let review = {} // Review object
          review['content'] = elem.innerText // Add review content
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


