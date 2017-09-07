var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");


var PORT = process.env.PORT || 3000;


mongoose.Promise = Promise;

var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static("public"));

//mongoose.connect("mongodb://localhost/scrapedData");

mongoose.connect("mongodb://heroku_4hfbt019:90ssl7v5hi3gvpgpeoqnobl7n@ds129374.mlab.com:29374/heroku_4hfbt019");

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
			//some links end with "/", which cause issues when link to article title
			if(link[link.length-1] === "/") {
				link = link.substring(0, link.length - 1);
			}
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


// // Grab an article by it's ObjectId
// app.get("/articles/note:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   Article.findOne({ "_id": req.params.id })
//   // ..and populate all of the notes associated with it
//   .populate("note")
//   // now, execute our query
//   .exec(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the doc to the browser as a json object
//     else {
//       res.json(doc);
//     }
//   });
// });



// // Create a new note or replace an existing note
// app.post("/articles/note/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   var newNote = new Note(req.body);

//   // And save the new note the db
//   newNote.save(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise
//     else {
//       // Use the article id to find and update it's note
//       Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
//       // Execute the above query
//       .exec(function(err, doc) {
//         // Log any errors
//         if (err) {
//           console.log(err);
//         }
//         else {
//           // Or send the document to the browser
//           res.send(doc);
//         }
//       });
//     }
//   });
// });




app.listen(PORT, function() {
  console.log("App running");
});