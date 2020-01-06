var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var User = require("../../../models/user");

//need to use callback
User.deleteMany({}, function(err){
	if (err) {
		console.log(err);
	}
	else {
	    console.log("...CLEAR!");
	}
});