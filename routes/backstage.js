
var express = require("express");
var router  = express.Router({mergeParams: true});

var middleware = require("../models/middleware");
var eventfunc = require("../models/eventfunc");


var Event = require("../models/event");
var Treasure = require("../models/treasure");


router.post("/user/", function(req, res){
	
});

router.post("/treasure/", function(req, res){
	
});

router.post("/article/", function(req, res){
	
});



module.exports = router;