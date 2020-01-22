
var express = require("express");
var router  = express.Router({mergeParams: true});

var middleware = require("../models/middleware");
var User = require("../models/user");

router.get("/",
	middleware.isLogIned,
	middleware.findUser, //it can be rebased with closure
	middleware.findAllTreasures,
	middleware.findUserArticles,
	middleware.findUserDeallogs,
	function(req, res){
		res.render("users/account", {
			user: res.locals.foundUser,
			foundAllTreasures: res.locals.foundAllTreasures,
			foundUserArticles: res.locals.foundUserArticles,
			foundUserDeallogs: res.locals.foundUserDeallogs
		});
});



router.get("/edit", middleware.isLogIned,	function(req, res){
	User.findOne({_id: req.user._id}, function(err, found){
	    if (err) {
	    	console.log(err);
			res.send("error! user not found...");
	    }
	    else {
	        res.render("users/edit", {user: found});
	    }
	});
});

router.put("/",
	middleware.isLogIned,
	middleware.updateUser, //be care for someone edit his cash...
	function(req, res){
	    res.redirect("/user");
});



router.get("/:id",
	middleware.findAllTreasures,
	middleware.findUserUrlById(),
	//{authorid: res.locals.user._id}
	middleware.findArticle("foundUserArticles", [], [["authorid", "locals", "user", "_id"]]),
	function(req, res){
		res.render("users/userpage");
});


module.exports = router;