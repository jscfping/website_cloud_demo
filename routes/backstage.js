
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

router.put("/user/:id",
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




router.post("/treasure",
	middleware.isLogIned,
	middleware.create("Treasure", "nouse",
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
router.put("/treasure/:id",
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
router.delete("/treasure/:id",
	middleware.isLogIned,
	middleware.delete("Treasure"),
	//here would be fix for user's aliving treasure(user's shoplist, dealrecipe,treasure)
	//or just make it market Off when in real world
    function(req, res){
	    res.redirect("/backstage/");
});




router.post("/article",
	middleware.isLogIned,
	middleware.create("Article", "newArticle",
		[
			["title", "body", "article", "title"],
			["description", "body", "article", "description"],
			["authorid", "body", "article", "authorid"]
		],
	[]),
	middleware.passingStr([], [["locals", "newArticle", "authorid"]]),
	middleware.pushTo("User", "nouse", [],
		[
			["articles", "locals", "newArticle", "_id"]
		]
	),
    function(req, res){
		res.redirect("/backstage/");
});
router.put("/article/:id",
	middleware.isLogIned,
	middleware.update("Article", "nouse",
		[
			["title", "body", "article", "title"],
			["description", "body", "article", "description"]
			// ["authorid", "body", "article", "authorid"], //to practice data association
			//["created", "body", "article", "created"],
			//["isedited", "body", "article", "isedited"],
			//["edited", "body", "article", "edited"]
		],
	[]),
    function(req, res){
		res.redirect("/backstage/");
});
router.delete("/article/:id",
	middleware.isLogIned,
	middleware.deleteArticle,
    function(req, res){
	    res.redirect("/backstage/");
});



module.exports = router;