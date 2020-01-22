
var express = require("express");
var router  = express.Router({mergeParams: true});

var middleware = require("../models/middleware");
var eventfunc = require("../models/eventfunc");


var Event = require("../models/event");
var Treasure = require("../models/treasure");


router.get("/",
    middleware.isLogIned,
    middleware.findAllUsers,
	middleware.findAllTreasures,
	middleware.findAllArticles,
	function(req, res){
		res.render("backstage");  //it would add placeholder
});

router.post("/user/:id",
    middleware.isLogIned,
	middleware.update("User", "nouse",
		[
			["nickname", "body", "user", "nickname"],
			["age", "body", "user", "age"],
			["cash", "body", "user", "cash"],
			["location", "body", "user", "location"]
		],
	[]),
    function(req, res){
	    res.redirect("/backstage/");
});



router.post("/treasure/:id",
	middleware.isLogIned,
	middleware.update("Treasure", "nouse",
		[
			["id", "body", "treasure", "id"],
			["name", "body", "treasure", "name"],
			["image", "body", "treasure", "image"],
			["description", "body", "treasure", "description"],
			["price", "body", "treasure", "price"],
			["stocks", "body", "treasure", "stocks"]
		],
	[]),
    function(req, res){
	    res.redirect("/backstage/");
});





router.post("/article/:id",
	middleware.isLogIned,
	middleware.update("Article", "nouse",
		[
			["title", "body", "article", "title"],
			["description", "body", "article", "description"]
			//["authorid", "body", "article", "authorid"],
			//["created", "body", "article", "created"],
			//["isedited", "body", "article", "isedited"],
			//["edited", "body", "article", "edited"]
		],
	[]),
    function(req, res){
		res.redirect("/backstage/");
});



module.exports = router;