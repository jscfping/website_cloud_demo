
var express = require("express");
var router  = express.Router({mergeParams: true});

var middleware = require("../models/middleware");
var User = require("../models/user");
var Article = require("../models/article");

//R
router.get("/", middleware.isLogIned, function(req, res){

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

router.get("/new", middleware.isLogIned, function(req, res){
	var entry = "/myarticles/"
	res.render("articles/new", {entry: entry}); 
});


//C
router.post("/", middleware.isLogIned, function(req, res){
	
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
router.get("/:id/edit", middleware.checkOwnArticle, function(req, res){
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

router.put("/:id", middleware.checkOwnArticle, function(req, res){
	
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
router.delete("/:id", middleware.checkOwnArticle, function(req, res){
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


module.exports = router;