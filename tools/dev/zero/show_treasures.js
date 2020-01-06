var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var Treasure = require("../../../models/treasure");


Treasure.find({}, function(err, all){
	if (err) {
		console.log(err);
	}
	else {

		console.log(all);
	}
});