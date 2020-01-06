var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var User = require("../../../models/user");


var ty = new User({
	username: "ty",
    password: "ty",
	nickname: "TYman",
	age: 18,
	cash: 9999
});

ty.save(function (err, ty) {
    if (err) return console.error(err);
    console.log(ty+ "...added...");
});






