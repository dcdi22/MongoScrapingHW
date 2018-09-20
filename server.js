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
  console.log("HELLLOOOO")
  db.Article.find({"saved": true}).populate("notes").exec(function(err, articles){
    console.log(articles);
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  });
});
// app.get("/saved", function(req, res) {
//   db.Article.find({"saved": true}, function(err, data) {
//     var hbsObject = {
//       article: data
//     };
//     console.log(hbsObject);
//     res.render("saved", hbsObject);
//   });
// });

// A GET request to Scrape website
app.get('/scrape', function(req, res) {
  request('https://www.bitchmedia.org/culture', function(error, response, html) {
      var $ = cheerio.load(html);

      var results = [];

      $('div.views-row').each(function(i, element) {
          var result = {};

          result.title = $(this).find('h2').text();
          result.summary = $(this).find('.views-field-nothing').text() || $(this).find('.field-content').text() ;
          result.link = $(this).find('h2').find('a').attr('href');

          results.push(result);
      });

      db.Article.insertMany(results)
          .then(function() {
              res.send('Scrape Complete');
              //res.redirect("/")
          })
          .catch(function(err) {
              return res.json(err);
          });
          //res.redirect("/")
  });
});

// Should clear articles
app.get("/clear", function(req, res) {
  db.Article.remove({})
    .then(function() {
      res.send("Articles Removed");
    })
    .catch(function(err) {
      res.json(err);
    });
})

// Will get articles from mongodb
// app.get("/articles", function(req, res) {
//   db.Article.find({})
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// })

// Grab article by it's id
// app.get("/articles/:id", function(req, res) {
//   db.Article.findOne({"_id": req.params.id}).populate("note").then(function(dbArticle) {
//     res.json(dbArticle);
//   })
//   .catch(function(err) {
//     res.json(err);
//   });
// })

// Save an article
app.post("/articles/save/:id", function(req, res) {
  db.Article.findOneAndUpdate({"_id": req.params.id}, {"saved": true}).then(function(dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle);
    console.log(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
})

// Delete an article
app.post("/articles/delete/:id", function(req, res) {
  db.Article.deleteOne({"_id": req.params.id}).then(function() {
    res.send("Articles Removed");
  })
  .catch(function(err) {
    res.json(err);
  });
})



  

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});