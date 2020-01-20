
var express = require("express");
var router  = express.Router({mergeParams: true});

var middleware = require("../models/middleware");
var eventfunc = require("../models/eventfunc");


var Event = require("../models/event");
var Treasure = require("../models/treasure");


router.get("/",
    middleware.findAllUsers,
	middleware.findAllTreasures,
	middleware.findAllArticles,
	function(req, res){
		res.render("backstage");  //it would add placeholder
});

router.post("/user/:id",
    middleware.findUser,
    middleware.updateUser,  //fix me for only edit nickname, desc
    function(req, res){
	    res.redirect("/backstage/");
});

router.post("/treasure/:id", function(req, res){
	
});

router.post("/article/:id", function(req, res){
	
});



module.exports = router;