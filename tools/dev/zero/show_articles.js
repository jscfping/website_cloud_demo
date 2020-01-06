var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var User = require("../../../models/article");


User.find({}, function(err, allusers){
	if (err) {
		console.log(err);
	}
	else {
	    console.log(allusers);
	}
});
