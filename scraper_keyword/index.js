const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const os = require('os');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let browsers = 0;
let maxNumberOfBrowsers = 5;
let timeout = 1500000


router.get('/keyword', (req, res) => {
    console.log(os.hostname());
    let response = {
        msg: 'Endpoint to scrape product by keywords',
        hostname: os.hostname().toString()
    }
    res.send(response);
})

router.post('/products/keyword', async (req, res) => {
    req.setTimeout(timeout);
    try {
        let data = req.body;
        console.log(req.body.url);
        while (browsers == maxNumberOfBrowsers) {
            await sleep(1000);
        }
        await getProductsHandler(data).then(result => {
            let response = {
                msg: 'retrieved products ',
                hostname: os.hostname(),
                products: result
            }
            console.log('done');
            res.send(response);
        })
    } catch (error) {
        res.send({ error: error.toString()});
    }
})

const getProductsHandler = async ({url, commands, nrOfPages}) => {
    let pMng = require('./PuppeteerManager');
    let puppeteerMng = new pMng.PuppeteerManager({url, commands, nrOfPages});
    browsers += 1;
    try {
        let products = await puppeteerMng.getAllProducts().then(result => {
            return result;
        })
        browsers -=1;
        return products;
    } catch (error) {
        browsers -= 1;
        console.log(error)
    }
}

router.post('/product/product-reviews', async (req, res) => {
    req.setTimeout(timeout);
    try {
        console.log(req.body);
        
        await getProductReviewsHandler(req.body).then(result => {
            let response = {
                msg: 'retrieved products ',
                hostname: os.hostname(),
                reviews: result
            }
            console.log('done');
            res.send(response);
        })
    } catch (error) {
        res.send({ error: error.toString()});
    }
  });

  const getProductReviewsHandler = async ({url, commands, nrOfPages}) => {
    let pMng = require('./puppeteerManager')
    let puppeteerMng = new pMng.PuppeteerManager({url, commands, nrOfPages})
    browsers += 1
    try {
      let productReviews = await puppeteerMng.getProductReviews().then(result => {
        return result
      })
      browsers -= 1
      return productReviews
    } catch (error) {
      browsers -= 1
      console.log(error)
    }
  }
  


const sleep = (ms) => {
    console.log(' running maximum number of browsers')
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = router;