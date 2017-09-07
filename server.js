var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapedData");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.get("/scrape", function(req, res) {
	request("http://www.nba.com/", function(error, reponse, html) {
		var $ = cheerio.load(html);
		var result = {};

		$(".content_promo--headline").each(function(i, element) {
			var title = $(this).children().text();
			var link = $(this).parent().attr("href");

			//some links are not complete. Need "nba.com" in front
			if(link[0] === "/") {
				link = "http://www.nba.com".concat(link);
			};
			result.title = title;
			result.link = link;
			result.saved = false;

			var entry = new Article(result);
			entry.save(function(err, doc) {
				if (err) {
					console.log(err);
				}
				// else {
				// 	res.json(doc);
				// }
			});
		});

		Article.find({}, function(error, doc) {
			if (error) {
				console.log(error);
			}
			else {
				res.json(doc);
			}
		});
	});
});


app.get("/articles", function(req, res) {
	Article.find({}, function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});


app.get("/savedarticles", function(req, res) {
	Article.find({saved:true}, function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});



app.get("/cleararticles", function(req, res) {
	Article.remove({}, function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});


app.get("/articles/save/:id", function(req, res) {
	console.log(req.params.id);
	Article.findOneAndUpdate({"_id": req.params.id}, {"saved":true}, function(error, doc){
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}

	});
});

app.get("/articles/unsave/:id", function(req, res) {
	console.log(req.params.id);
	Article.findOneAndUpdate({"_id": req.params.id}, {"saved":false}, function(error, doc){
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}

	});
});






app.listen(3000, function() {
  console.log("App running on port 3000!");
});