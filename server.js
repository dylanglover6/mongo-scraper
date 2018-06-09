var express = require("express");
var exphbs = require("express-handlebars");
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

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Routes
// =============================================================
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use((req, res, next) => {
	req.db = db;
	next();
})

//require("./routes/html-routes.js")(app);

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
      //result.img = $(this)
      //  .children("a.gallery")
      //  .children("img.thumb")
      //  .attr("src")
      result.price = $(this)
        .children("p.result-info")
        .children("span.result-meta")
        .children("span.result-price")
        .text();
        result.location = $(this)
        .children("p.result-info")
        .children("span.result-meta")
        .children("span.result-hood")
        .text();
      
      db.Posting.create(result)
        .then(function(dbPosting) {
          console.log(dbPosting);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
  
    res.send("Scrape Complete")
  });
});

app.get("/postings", function(req, res) {
  db.Posting.find({}).sort({id: -1})
    .then(function(data) {
      res.render("index", {posting: data});
    })
    .catch(err => {
      res.sendStatus(500);
      console.log(err);
    });
});

app.get("/postings/:id", function(req, res) {
  db.Posting.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(data) {
      res.json(data);
    })
    .catch(err => {
      res.sendStatus(500);
      console.log(err);
    });
});

app.post("/postings/:id", function(req, res) {
  db.Posting.create(req.body)
    .then(function(data) {
      return db.Posting.findOneAndUpdate({ _id: req.params.id }, { note: data._id}, { new: true });
    })
    .then(function(data) {
      res.render("index", {posting: data});
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
