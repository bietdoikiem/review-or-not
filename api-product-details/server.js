const express = require("express");
const app = express();
const port = 3000;

// Import puppeteer function for getting data
const getProductDetails = require("./getProductDetails");

// Catches requests made to localhost:3000/search
app.get("/product", (request, response) => {
  // Holds value of the query param 'url'.
  const searchQuery = request.query.url;

  // Do something when the searchQuery is not null.
  if (searchQuery != null) {
    getProductDetails(searchQuery).then((results) => {
      // Returns a 200 Status OK with Results JSON back to the client.
      response.status(200);
      response.json(results);
    });
  } else response.end();
});

//Initializes the express server on the port 30000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));