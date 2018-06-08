var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/craigslistScraper");

// Routes

var city = "austin"
//GET Route to scrape Craigslist
app.get("/scrape", function(req, res) {
  axios.get("https://" + city + ".craigslist.org/search/bia?hasPic=1").then(function(response) {
    var $ = cheerio.load(response.data);

    $("li.result-row").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("p.result-info")
        .children("a.result-title")
        .text();
      result.link = $(this)
        .children("p.result-info")
        .children("a.result-title")
        .attr("href");
      result.img = $(this)
        .children("a.result-image")
        .children("div.swipe")
        .children("div.swipe-wrap")
        .children("")
      
      db.Posting.create(result)
        .then(function(dbComment) {
          console.log(dbComment);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
  
    res.send("Scrape Complete")
  });
});



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
