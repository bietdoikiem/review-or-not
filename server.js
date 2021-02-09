const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const keyword = require('./scraper_keyword/index');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  
  }

/* ---- Define main endpoints ---- */
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to ReviewOrNot's API"
    })
})

app.use("/api", keyword);
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
});
