var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var User = require("../../../models/user");


User.find({}, function(err, allusers){
	if (err) {
		console.log(err);
	}
	else {
		
		console.log(allusers);
		console.log(">>>" + allusers[0].shoppinglist);

		
	}
});



// User.find().populate("shoppedlist.id").exec(function(err, allusers){
// 			console.log(allusers);
// });
		

