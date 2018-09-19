// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");


// Require all models
var db = require("./models");
// ex: db.Article
// ex: db.Note


// Scrapping tools
var request = require("request");
var cheerio = require("cheerio");


// Define port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Make public a static dir
app.use(express.static("public"));
// app.use(express.static(__dirname + '/public' ));

// Set handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");


// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/MongoScraper");



// ROUTES
// =========================================

// GET routes to render handlebar pages
app.get("/", function(req, res) {
  db.Article.find({"saved": false}, function(err, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("home", hbsObject);
  });
});

app.get("/saved", function(req, res) {
  db.Article.find({"saved": true}).populate("notes").then(function(err, articles){
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  });
});

// A GET request to Scrape website
app.get("/scrape", function(req, res) {
  request("https://www.nytimes.com/", function(error, response, html) {
    var $ =  cheerio.load(html);

    $("article").each(function(i, element) {
      var result = {};

      result.title = $(this).children("h2").text();
      result.summary = $(this).children(".summary").text();
      result.link = $(this).children("h2").children("a").attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
    //res.redirect("/");
  });
});



  

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});