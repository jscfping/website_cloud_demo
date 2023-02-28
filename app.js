const exeParas = require("./exeParas");


var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");




//mongoose setup
mongoose.set("useUnifiedTopology", true);
mongoose.connect(exeParas.mongoDBConnectString, {useNewUrlParser: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
	console.log("mongoose........connected");
});

// mongoose schema setup
var User = require("./models/user");
var Article = require("./models/article");
var ArticleComment = require("./models/comment/articlecomment");
var Treasure = require("./models/treasure");
var Event = require("./models/event");


// set up express
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "cloud_demo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// res.locals is form express
// for every req, would add a currentUser to res in ejs (locals)
// req.user is from passport for a authenticated user
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


//set up middleware
var middleware = require("./models/middleware");
var dbfunc = require("./models/dbfunc");
var reset_rebot = require("./services//schedule/reset_rebot");
var config = require("./models/config");

if(config.isAutoReset){
    reset_rebot.tmr();
}





//
//
//routes
app.get("/",function(req, res){
	dbfunc.findsByProp(Event, {}).then((founds)=>{
		res.render("index", {events: founds, nextTime: reset_rebot.nextTime});
	}
	).catch((e)=>{
		console.log(err);
		res.send(e);
	});
});






// show register form
app.get("/register", function(req, res){
    res.render("users/register"); 
});

// handle sign up logic
app.post("/register",
	middleware.register(),
	function(req, res){
		//http://www.passportjs.org/docs/authenticate/
		//JS' closure
		passport.authenticate("local")(req, res, function(){
			Event.findOne({eid: "1001"}, (err, found)=>{
				if(err){
					res.send("not find event page...");
				}
				else{
					res.redirect("/events/" + found._id);
				}
			})
			
		});
	}
);



// show login form
app.get("/login", function(req, res){
    if(req.user){
        res.redirect("/"); 
	}else{
		res.render("users/login"); 
	}
});

// handling login logic
app.post("/login",
	passport.authenticate("local",{
            successRedirect: "/user",
            failureRedirect: "/login"
        }
	),
    function(req, res){
});


// logout route
app.get("/logout", function(req, res){
	if(req.user){
		req.logout();
        res.redirect("/"); 
	}else{
		res.redirect("/login"); 
	}
});


// user routes
var userRoutes = require("./routes/user");
app.use("/user", userRoutes);



const apiUserRoutes = require("./routes/api/user");
app.use(apiUserRoutes.prePath, apiUserRoutes.router);

//articles routes (pbulic) would to be rebase between public and private
//it can be add a function to judge entry to redirect proper place to make code more dry
var articlesRoutes = require("./routes/articles");
app.use("/articles", articlesRoutes);

//articles routes (private)
var myarticlesRoutes = require("./routes/myarticles");
app.use("/myarticles", myarticlesRoutes);


//treasures routes
var treasuresRoutes = require("./routes/treasures");
app.use("/treasures", treasuresRoutes);

//shoppinglist routes
var shoppinglistRoutes = require("./routes/shoppinglist");
app.use("/shoppinglist", shoppinglistRoutes);

//checkout
//
//
app.post("/checkout",
	middleware.isLogIned,
    middleware.chkOrderReq,
	middleware.makeOrder,
	middleware.handDealRecipe,
	middleware.passItemToUser,
    middleware.chargeUser,
	middleware.finishOrder,
	function(req, res){

	res.redirect("/user");

});


//events routes
var eventRoutes    = require("./routes/events");
app.use("/events", eventRoutes);

//backstage routes
var backstageRoutes    = require("./routes/backstage");
app.use("/backstage", backstageRoutes);




// others
//
//
app.get("/getcash", middleware.isLogIned, function(req, res){
	
	if(req.user){ //to be rebase
	    User.findOne({_id: req.user._id}, function(err, found){
	    	if(err){
	    		console.log(err);
				res.send("find user id err");
	    	}
	    	else{
	    		found.cash += 1000;
				
				User.updateOne({_id: req.user._id}, found, function(err, sign){
	                if(err){
						console.log();
	                    res.send("database update error");
	                } else {
	                    res.redirect("/");
	                }
	            });

	    	}
	    });
	}

});



app.get("/replenishment",
	middleware.isLogIned,
	middleware.isStockOut,
	middleware.replenishment,
	function(req, res){
	    res.redirect("/");
});



app.get("*",function(req, res){
	 res.send("not found...");
});




app.listen(exeParas.executingPort, function(){
   console.log(`The Server is running at: http://localhost:${exeParas.executingPort}`);
});


