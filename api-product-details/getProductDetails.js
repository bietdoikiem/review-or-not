const puppeteer = require("puppeteer");

const getProductDetails = async (searchQuery) => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(searchQuery);

  // Pause the function for 6s
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  await sleep(6500);

  // Click the "I AM OVER 18" if the dialog shows in the page
  if ((await page.$(".shopee-alert-popup__message")) !== null)
    await page.click(".shopee-alert-popup__btn");

  // Get all Specifications
  const specifications = await page.$$eval("._2gVYdB > label", (cates) =>
    cates.map((cate) => cate.textContent)
  );

  // Get all Details
  const details = await page.$$eval("._2gVYdB > div", (cates) =>
    cates.map((cate) => cate.textContent)
  );
  console.log(specifications);
  console.log(details);
  console.log("Done");

  // Array to hold all our results
  let dataObj = {};

  // Take each element and store it
  // Title
  dataObj["title"] = await page.$eval(
    "._3ZV7fL > span",
    (text) => text.textContent
  );

  // URL image
  dataObj["imageUrl"] = await page.$eval("._39-Tsj > div", (div) =>
    div
      .getAttribute("style")
      .substring(23, div.getAttribute("style").indexOf(")") - 1)
  );

  // Rating - 2 conditions to check if there are ratings or not
  if ((await page.$("._3WXigY")) !== null) {
    dataObj["rating"] = await page.$eval(
      "._3WXigY",
      (text) => text.textContent
    );
  } else dataObj["rating"] = null;

  // Price
  dataObj["price"] = await page.$eval(".AJyN7v", (text) => text.textContent);

  // Category
  dataObj["category"] = await page.$$eval("._2gVYdB > ._1qYtEg > a", (cates) =>
    cates.map((cate) => cate.textContent)
  );
  dataObj["category"].shift();

  // Brand
  dataObj["brand"] = await page.$eval(
    "._2gVYdB > a",
    (text) => text.textContent
  );
  if (dataObj["brand"] == "No Brand") dataObj["brand"] = null;

  // Stock
  for (var i = 0; i < specifications.length; i++) {
    if(specifications[i] == "Stock") 
      dataObj["stock"] = details[details.length - specifications.length + i];
  }

  // Other specifications
  // for (var i = 0; i < specifications.length; i++) {
  //   dataObj[specifications[i]] = details[i];
  // }

  // Description
  dataObj["description"] = await page.$eval(
    "._36_A1j > span",
    (text) => text.textContent
  );

  await browser.close();
  return dataObj;
};

module.exports = getProductDetails;