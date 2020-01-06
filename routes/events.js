
var express = require("express");
var router  = express.Router();  //var router  = express.Router({mergeParams: true});

var middleware = require("../models/middleware");
var eventfunc = require("../models/eventfunc");


var Event = require("../models/event");
var Treasure = require("../models/treasure");


router.get("/", function(req, res){
	Event.find({}, function(err, founds){
	    if (err) {
	    	console.log(err);
			res.send("events found error!");
	    }
	    else {
			Treasure.find({}, (err, treasures)=>{
                if(err){
					console.log(err);
					res.send("event page's treasures init error");
				}
				else{
					res.render("events/_dev", {
						user: req.user, allevents: founds,
						treasures: treasures
					}); 
				}
			});
	    }
	});
});


router.get("/:id",
	eventfunc.find,
	middleware.findAllTreasures,
	eventfunc.eventPrepare,
    function(req, res){
		if(res.locals.running_event.isSuc){
			res.render("events/e" + res.locals.running_event.eid, {
				event: res.locals.running_event, 
				extra: res.locals.running_event.result
			}); 
		}
		else{
            res.send(res.locals.running_event.result, {foundAllTreasures: res.locals.foundAllTreasures});
		}
});




router.post("/:id",
	middleware.isLogIned,
	eventfunc.find,
	eventfunc.isUidFinish,
	eventfunc.logic,
	eventfunc.sendReward,
	eventfunc.finish,
	function(req, res){

	res.redirect("/events/" + req.params.id);
});


module.exports = router;