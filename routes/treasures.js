
var express = require("express");
var router  = express.Router({mergeParams: true});

//var middleware = require("../models/middleware");
var Treasure = require("../models/treasure");


router.get("/", function(req, res){
	
	Treasure.find({}, function(err, founds){
	    if (err) {
	    	console.log(err);
			res.send("error!");
	    }
	    else {
	        res.render("treasures/dev", {alltreasures: founds}); 
	    }
	});

});

router.get("/:id", function(req, res){
	
	Treasure.findOne({_id: req.params.id}, function(err, found){
	    if (err) {
	    	console.log(err);
			res.send("found treasure error!");
	    }
	    else {
	        res.render("treasures/show", {treasure: found}); 
	    }
	});

});



module.exports = router;