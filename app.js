var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");




//mongoose setup
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true}); // use for mongoose to use sth
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
app.use(express.static(__dirname + "/public")); // __dirname means current folder???
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
// for every req, would add a currentUser to res in ejs
// req.user is from...???
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


//set up middleware
var middleware = require("./models/middleware");
var dbfunc = require("./models/dbfunc");
var keyy = require("./keyy");
var reset_rebot = require("./models/reset_rebot");
var config = require("./models/config");

if(config.isAutoReset){
	reset_rebot.go();
}













//routes
app.get("/",function(req, res){
	Event.find({}, function(err, founds){
	    if (err) {
	    	console.log(err);
			res.send("events found error!");
		}
		else{
			res.render("index", {events: founds});
		}
	    
	})
});






// show register form
app.get("/register", function(req, res){
    res.render("users/register"); 
});

// handle sign up logic
app.post("/register", function(req, res){

	var newUser = new User({username: req.body.username});
	userInfoInit(newUser); //better method???
	
	//here would add a lowcase check!!!
    
	User.register(newUser, req.body.password, function(err, user){  //from passport-local-mongoose
        if(err){
            console.log(err);
            return res.render("users/register");
        }
		
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
    });
});



// show login form
app.get("/login", function(req, res){
	//can be better
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







app.get("/u", function(req, res){
	User.find({}, function(err, allusers){
	    if (err) {
	    	console.log(err);
			res.send("error! users not found...");
	    }
	    else {
	        res.render("users/dev", {allusers: allusers});
	    }
	});
});



app.get("/user",
	middleware.isLogIned,
	middleware.findUser, //it can be rebased with closure
	middleware.findAllTreasures,
	middleware.findUserArticles,
	middleware.findUserDeallogs,
	function(req, res){
		res.render("users/account", {
			user: res.locals.foundUser,
			foundAllTreasures: res.locals.foundAllTreasures,
			foundUserArticles: res.locals.foundUserArticles,
			foundUserDeallogs: res.locals.foundUserDeallogs
		});
});



app.get("/user/edit", middleware.isLogIned,	function(req, res){
	User.findOne({_id: req.user._id}, function(err, found){
	    if (err) {
	    	console.log(err);
			res.send("error! user not found...");
	    }
	    else {
	        res.render("users/edit", {user: found});
	    }
	});
});

app.put("/user/",
	middleware.isLogIned,
	middleware.updateUser, //be care for someone edit his cash...
	function(req, res){
	    res.redirect("/user");
});



app.get("/user/:id",
    middleware.findAllTreasures,
	function(req, res){
		User.findOne({_id: req.params.id}, function(err, found){
			if (err) {
				console.log(err);
				res.send("error! user not found...");
			}
			else {
				Article.find({authorid: found._id}, function(err, foundUserArticles){
					if (err) {
						console.log(err);
						res.send("error! article not found...");
					}
					else {
						res.locals.foundUserArticles = foundUserArticles;
						res.render("users/userpage", {user: found});
					}
				});
			}
		});
});









//articles (pbulic)
//
//

//R
app.get("/articles", function(req, res){
    //if author:{id, username}
	//what in populate run needs a OBJECTIDTYPE, not for author(get a []) but author.id
	//and can be id's array
	//after expansion, the origin obj id would add mongoose's _id and other data
	// like author.id, author.id._id
	var entry = "/articles/"
	Article.find().populate("authorid").exec(function(err, allarticles){
	    if (err) {
	    	console.log(err);
			res.send("article found error!");
	    }
	    else {
	        res.render("articles/dev", {allarticles: allarticles, entry: entry}); 
	    }
	});
});


app.get("/articles/new", middleware.isLogIned, function(req, res){
	var entry = "/articles/"
	res.render("articles/new", {entry: entry}); 
});



//C
app.post("/articles", middleware.isLogIned, function(req, res){
	
	var newArticle = new Article(req.body.article);
	newArticle.authorid = req.user._id;
	
	newArticle.save(function (err, article) {
        if (err){
			console.log(err);
		    res.send("article created error!");
	    }
		else{
			User.findOne({_id: req.user._id}, (err, founduser)=>{
				if(err){
					console.log(err);
		            res.send("find user whom the article belonged to  error!");
				}
				else{
					founduser.articles.push(newArticle._id);
					User.updateOne({_id: req.user._id}, founduser, function(err, sign){
	                    if(err){
	                        console.log(err);
							res.send("update user whom the article belonged to  error!");
	                    }
	                	else{
	                        res.redirect("/articles/");
	                    }
	                });
				}
			});

		}
     });
});


//U
app.get("/articles/:id/edit", middleware.checkOwnArticle, function(req, res){
	var entry = "/articles/";
	Article.findOne({ _id: req.params.id}, function(err, article){
	    if(err){
	        console.log(err);
			res.send("articles database found error...");
	    }
		else{
	        res.render("articles/edit", {article: article, entry:entry});
	    }
	});
});

app.put("/articles/:id", middleware.checkOwnArticle, function(req, res){
	
	var newdata = req.body.article;
	newdata.isedited = true;
	newdata.edited = new Date;
	
	//req.body.blog.body = req.sanitize(req.body.blog.body);wait for update
	Article.updateOne({ _id: req.params.id}, newdata, function(err, sign){
	    if(err){
			console.log(err);
			res.send("articles database updated error...");
	    }
		else{
			res.redirect("/articles/");
	    }
		
	});

});



//D
app.delete("/articles/:id", middleware.checkOwnArticle, function(req, res){
	Article.deleteOne({_id: req.params.id}, function(err){
		if(err){
			console.log(err);
			res.send("articles database deleded error...");
		}
		User.findOne({_id: req.user._id}, (err, foundusr)=>{

			if(err){
				console.log(err);
			    res.send("user database find error...");
			}
			else{
				for(var i=0; i<foundusr.articles.length; i++){
					if(foundusr.articles[i]._id.toString() === req.params.id.toString()){
						foundusr.articles.splice(i,1);
						break;
					}
				}
	
				User.updateOne({_id: req.user._id}, foundusr, (err, sign)=>{
					if(err){
						console.log(err);
						res.send("user database updated error...");
					}
					else{
                        res.redirect("/articles");
					}

				});
			}

			
		});
		
	});
});






//articles (private)
//it can be add a function to judge entry to redirect proper place to make code more dry!!!
//

//R
app.get("/myarticles", middleware.isLogIned, function(req, res){

	var entry = "/myarticles/";
	Article.find({authorid: req.user._id}).populate("authorid").exec(function(err, myarticles){
	    if (err) {
	    	console.log(err);
			res.send("article found error!");
	    }
	    else {
	        res.render("articles/dev", {allarticles: myarticles, entry:entry}); 
	    }
	});
});

app.get("/myarticles/new", middleware.isLogIned, function(req, res){
	var entry = "/myarticles/"
	res.render("articles/new", {entry: entry}); 
});


//C
app.post("/myarticles", middleware.isLogIned, function(req, res){
	
	var newArticle = new Article(req.body.article);
	newArticle.authorid = req.user._id;
	
	newArticle.save(function (err, article) {
        if (err){
			console.log(err);
		    res.send("article created error!");
	    }
		else{
			User.findOne({_id: req.user._id}, (err, founduser)=>{
				if(err){
					console.log(err);
		            res.send("find user whom the article belonged to  error!");
				}
				else{
					founduser.articles.push(newArticle._id);
					User.updateOne({_id: req.user._id}, founduser, function(err, sign){
	                    if(err){
	                        console.log(err);
							res.send("update user whom the article belonged to  error!");
	                    }
	                	else{
	                        res.redirect("/myarticles/");
	                    }
	                });
				}
			});

		}
     });
});


//U
app.get("/myarticles/:id/edit", middleware.checkOwnArticle, function(req, res){
	var entry = "/myarticles/";
	Article.findOne({ _id: req.params.id}, function(err, article){
	    if(err){
	        console.log(err);
			res.send("articles database found error...");
	    }
		else{
	        res.render("articles/edit", {article: article, entry:entry});
	    }
	});
});

app.put("/myarticles/:id", middleware.checkOwnArticle, function(req, res){
	
	var newdata = req.body.article;
	newdata.isedited = true;
	newdata.edited = new Date;
	
	//req.body.blog.body = req.sanitize(req.body.blog.body);wait for update
	Article.updateOne({ _id: req.params.id}, newdata, function(err, sign){
	    if(err){
			console.log(err);
			res.send("articles database updated error...");
	    }
		else{
			res.redirect("/myarticles/");
	    }
		
	});

});



//D
app.delete("/myarticles/:id", middleware.checkOwnArticle, function(req, res){
	Article.deleteOne({_id: req.params.id}, function(err){
		if(err){
			console.log(err);
			res.send("articles database deleded error...");
		}
		User.findOne({_id: req.user._id}, (err, foundusr)=>{

			if(err){
				console.log(err);
			    res.send("user database find error...");
			}
			else{
				for(var i=0; i<foundusr.articles.length; i++){
					if(foundusr.articles[i]._id.toString() === req.params.id.toString()){
						foundusr.articles.splice(i,1);
						break;
					}
				}
	
				User.updateOne({_id: req.user._id}, foundusr, (err, sign)=>{
					if(err){
						console.log(err);
						res.send("user database updated error...");
					}
					else{
                        res.redirect("/myarticles");
					}

				});
			}

			
		});
		
	});
});







//treasures
//
//
app.get("/treasures", function(req, res){
	
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

app.get("/treasures/:id", function(req, res){
	
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








//show shoppinglist
app.get("/shoppinglist",
	middleware.isLogIned,
	middleware.getShoppingListRecipe,
	function(req, res){
	    res.render("users/shoppinglist");
});

//shopping list add function
app.put("/shoppinglist/:id",
	middleware.isLogIned,
	middleware.chkMarketOffReq,
	middleware.marketOff,
	middleware.shopListIn,
	function(req, res){
	    res.redirect("/shoppinglist");
});

//shopping list pop function
app.delete("/shoppinglist/:id",
	middleware.isLogIned,
	middleware.chkShopListOutReq,
    middleware.shopListOut,
    middleware.marketOn,
	function(req, res){
	    res.redirect("/shoppinglist");
});




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

















//events
//
//
var eventRoutes    = require("./routes/events");
app.use("/events", eventRoutes);



















app.get("/getcash", middleware.isLogIned, function(req, res){
	
	if(req.user){ //can be better
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




app.listen(3000, function(){
   console.log("The Server Has Started...");
});










//function
function userInfoInit(obj){
    obj.nickname= obj.username;
	obj.cash= 0;
};



function UTC(x){
	if(x){
        return x.getTime().toString()
    }
}

//useless
function checkInObjHasNull(obj){
	var propertyary = Object.keys(obj)
	for(var i=0; i<propertyary.length; i++){
		if(!x[propertyary[i]]) return true;
	}
	return false;
};