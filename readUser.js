var mongoose = require("mongoose");
var dbfunc = require("./models/dbfunc");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var User = require("./models/user");
var Dealterm = require("./models/deallog/dealterm");
var Dealrecipe = require("./models/deallog/dealrecipe");

User.find({}, function(err, allusers){
	if (err) {
		console.log(err);
	}
	else {

        //console.log(allusers);
        dbfunc.findIds(Dealterm, allusers[0].deallog)
            .then((resolve)=>{
                //console.log(resolve);
                allusers.deallog = resolve;
                console.log(allusers);
        });
        


		
	}
});



