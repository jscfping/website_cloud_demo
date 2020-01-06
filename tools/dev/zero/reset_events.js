var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var Event = require("../../../models/event");




Event.find({}, function(err, founds){
	if(err){
		console.log(err);
	}
	else{
		founds.forEach((el)=>{
			el.finish_uid = [];
			el.save(function (err, el){
                if(err){
                    console.log(err);
                }
		    	console.log(el + "...finish_uid CLEAR...");
            });
		});
	}
});


