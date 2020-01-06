var User = require("./user");
var Article = require("./article");
var Treasure = require("./treasure");
var Dealterm = require("./deallog/dealterm");
var Dealrecipe = require("./deallog/dealrecipe");
var dbfunc = require("./dbfunc");
var middleware = {};


middleware.isLogIned = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

//it can be rebased with closure!!!!!
//is there better script???
middleware.checkOwnArticle = function(req, res, next){
	if(req.isAuthenticated()){
		Article.findOne({_id: req.params.id}, function(err, found){
			if(err){
				console.log(err);
		        res.send("article can't found or sth err");
			}
			else{
				if(found.authorid.equals(req.user._id)){
					next();
				}
				else{
					res.send("you didn't have the article's permission!"); 
				}
			}
		})
	}
	else{
		res.redirect("/login");
	}
};





middleware.getShoppingListRecipe = function(req, res, next){
    var stu = "......@getShoppingListRecipe";
	dbfunc.findById(User, req.user._id).then(
	    (resolve, reject)=>{
			var found = resolve["_doc"];
			var AryGottenData = [];
			var AryPromised = [];	
			
			for(var i=0; i <found.shoppinglist.length; i++){
				AryGottenData.push(dbfunc.findById(Treasure, found.shoppinglist[i].id));
				
				//catch become a resolve for Promise.all
				AryPromised.push(
					AryGottenData[i].then(dbfunc.promisePasser).catch(dbfunc.promisePasser)
				);
			}
			

			//promise.all would catched by just A catch...
			Promise.all(AryPromised).then((val)=>{
				//val would be a array including each AryPromised promised
				for(var i=0; i <found.shoppinglist.length; i++){
					found.shoppinglist[i] = found.shoppinglist[i]["_doc"]; //shoppinglist[i]is not only a pure obj rather than a mongoose obj
					if(val[i].equals("database find error")){
						found.shoppinglist[i].property = null;
					}
					else{
						found.shoppinglist[i].property = val[i];  
					}
				}
				res.locals.userdata = found;
				next();
			});
		}
	).catch((e)=>{
		res.send(e + stu);
	});
};



middleware.chkMarketOffReq = function(req, res, next){
	var stu = "......@chkMarketOffReq";
	var reqqty = Number(req.body.shoppinglist.qty);
	if(reqqty > 0){
		
		req.body.shoppinglist.qty = Math.floor(reqqty)
		if(req.body.shoppinglist.qty >=1){
			next();
		}
		else{
			res.send("your qty is strange....." + stu);
		}
		
	}
	else{
		res.send("qty would >0 to add your shoppinglist" + stu);
	}
};


middleware.marketOff = function(req, res, next){
    var stu = "......@marketOff";
	dbfunc.findById(Treasure, req.params.id).then(
	    (resolve, reject)=>{
			var found = resolve;
			var qty = Number(req.body.shoppinglist.qty);
			if(qty <= found.stocks){
				found.stocks -= qty; 
				dbfunc.updateById(Treasure, req.params.id, found).then(()=>{
					next();
				});
			}
			else{
				res.send("we don't have so much stocks" +stu);
			}
		}
	).catch((e)=>{
		res.send(e + stu);
	});
};



middleware.shopListIn = function(req, res, next){
    var stu = "......@shopListIn";
	
	dbfunc.findById(User, req.user._id).then(
	    (resolve, reject)=>{
			var found = resolve;
			
			var idx = -1;
	    	for(var i=0; i<found.shoppinglist.length; i++){
	    		if(found.shoppinglist[i].id.equals(req.params.id)){
	    			idx = i;
	    			break;
	    		}
	    	}

			if(idx >= 0){ //already exist
	    		found.shoppinglist[idx].qty += Number(req.body.shoppinglist.qty);
				//be careful string type...
	    	}
	    	else{
	    		req.body.shoppinglist.id = req.params.id;
	    		found.shoppinglist.push(req.body.shoppinglist);
	    	}
			
			dbfunc.updateById(User, req.user._id, found).then(()=>{
				next();
			});

		}
	).catch((e)=>{
		res.send(e + stu);
	});
};






middleware.chkShopListOutReq = function(req, res, next){
	var stu = "......@chkShopListOffReq";
	var reqqty = Number(req.body.shoppinglist.qty);
	if(reqqty > 0){
		req.body.shoppinglist.qty = Math.floor(reqqty)
		if(req.body.shoppinglist.qty >=1){
			next();
		}
		else{
			res.send("your qty is strange....." + stu);
		}
	}
	else{
		res.send("qty would >0 to pop your shoppinglist" + stu);
	}
};


middleware.shopListOut = function(req, res, next){
    var stu = "......@shopListOut";
	dbfunc.findById(User, req.user._id).then(
	    (resolve, reject)=>{
			var found = resolve;
			var id = req.params.id;
	        var qty = Number(req.body.shoppinglist.qty);


			var idx = -1;
			for(var i=0; i<found.shoppinglist.length; i++){
				if(found.shoppinglist[i].id.equals(id)){
					idx = i;
					break;
				}
			}
			if(idx<0){
				res.send("it is not in your shoppinglist" + stu);
			}


			if(qty <= found.shoppinglist[idx].qty){
				if(qty < found.shoppinglist[idx].qty){
                	found.shoppinglist[idx].qty -= qty;
                }
                else{
                	found.shoppinglist.splice(idx,1);
                }

				dbfunc.updateById(User, req.user._id, found).then(()=>{
					next();
				});
			}
			else{
				res.send("you don't have much qty" + stu);
			}

			
		}
	).catch((e)=>{
		res.send(e + stu);
	});

};



middleware.marketOn = function(req, res, next){
    var stu = "......@marketOn";
	dbfunc.findById(Treasure, req.params.id).then(
	    (resolve, reject)=>{
            var found = resolve;
            found.stocks += Number(req.body.shoppinglist.qty);
			dbfunc.updateById(Treasure, req.params.id, found).then(()=>{
		        next();
	        });
		}
	).catch((e)=>{
		res.send(e + stu);
	});
};





middleware.chkOrderReq = function(req, res, next){
	var stu = "......@chkOrderReq";
	dbfunc.findById(User, req.user._id).then(
	    (resolve, reject)=>{
			var found = resolve; //is used to logic, not to save
			if(found.shoppinglist.length>0){
				var AryGottenData = [];
			    var AryPromised = [];   
			    
			    for(var i=0; i <found.shoppinglist.length; i++){
			    	AryGottenData.push(dbfunc.findById(Treasure, found.shoppinglist[i].id));
			    	//catch become a resolve for Promise.all
			    	AryPromised.push(
			    		AryGottenData[i].then(dbfunc.promisePasser).catch(dbfunc.promisePasser)
			    	);
			    }
    
			    //promise.all would catched by just A catch...
			    Promise.all(AryPromised).then((val)=>{
			    	//val would be a array including each AryPromised promised
			    	for(var i=0; i <found.shoppinglist.length; i++){
			    		found.shoppinglist[i] = found.shoppinglist[i]["_doc"]; //shoppinglist[i]is not only a pure obj rather than a mongoose obj
			    		if(val[i].equals("database find error")){
			    			found.shoppinglist[i].property = null;
			    		}
			    		else{
			    			found.shoppinglist[i].property = val[i];  
			    		}
			    	}
					
					var isAllgood = true;
					for(var i=0; i <found.shoppinglist.length; i++){
			    		if(found.shoppinglist[i].property === null){
							isAllgood = false;
							stu = "order has illegal item..." + stu;
							break;
						}
						
						found.shoppinglist[i].qty = Math.floor(found.shoppinglist[i].qty);
						if (!(found.shoppinglist[i].qty > 0)){
							isAllgood = false;
							stu = "order has illegal qty..." + stu;
							break;
						}
			    	}
					
					if(isAllgood){
						
						res.locals.userdata = found["_doc"];
			    	    next();
					}
					else{
						res.send("something wrong in your shoppinglist" + stu);
					}

			    	
			    });
				
			}
			else{
				res.send("your shopping list has nothing..." + stu);
			}
		}
	).catch((e)=>{
		res.send(e + stu);
	});
};




middleware.makeOrder = function(req, res, next){
	var stu = "......@makeOrder";
	
	var sum = 0;
	for(var i=0; i <res.locals.userdata.shoppinglist.length; i++){
		res.locals.userdata.shoppinglist[i].property.subtotal =
		    Number(res.locals.userdata.shoppinglist[i].qty) *
			Number(res.locals.userdata.shoppinglist[i].property.price);
		sum += res.locals.userdata.shoppinglist[i].property.subtotal;
	}
	
	var neworder = new Dealterm({
		ownerid: req.user._id,
		price: sum
	})
	
	if(res.locals.userdata.cash >= sum){
		neworder.save(function (err, neworder) {
            if (err){
		    	console.log(err);
		    	res.send("new order save fail..." + stu);
		    }
		    else{
		    	console.log(neworder+ "...a new order added...");
		    	res.locals.runningOrder = neworder;
		    	res.locals.userdata.deallog.push(neworder._id);
		    	//be care of  .shoppinglist.property
				//save user's deallog first to track
		    	dbfunc.updateById(User, req.params.id, res.locals.userdata).then(()=>{
		            console.log("a new order push in user's db...");
		    		next();
	            }).catch((e)=>{
	            	res.send(e + stu);
	            });
		    }
        });
	}
	else{
		res.send("please store values to your cash first..." + stu);
	}
	
	
};



middleware.handDealRecipe = function(req, res, next){
	var stu = "......@handDealRecipe";

	var dealRecipeSchemaAry = [];
	var AryGottenData = [];
	var AryPromised = [];
	var dealRecipeIdAry = [];
	
	//after saving ALL recipe from shoppinglist, then...
	for(var i=0; i<res.locals.userdata.shoppinglist.length; i++){
		dealRecipeSchemaAry.push(new Dealrecipe({
			ownerid: res.locals.runningOrder._id,
			itemid: res.locals.userdata.shoppinglist[i].id,
			qty: res.locals.userdata.shoppinglist[i].qty,
			price: res.locals.userdata.shoppinglist[i].property.price,
			subtotal: res.locals.userdata.shoppinglist[i].property.subtotal
		}));
		//dbfunc.createBySha = function(newone)
		AryGottenData.push(dbfunc.createBySha(dealRecipeSchemaAry[i]));
		AryPromised.push(
			AryGottenData[i].then(dbfunc.promisePasser).catch(dbfunc.promisePasser)
		);
	}

	//promise.all would catched by just A catch...
	Promise.all(AryPromised).then((val)=>{
		
		var isValReasonable = true;
		//val would be a array including each AryPromised promised
		for(var i=0; i <res.locals.userdata.shoppinglist.length; i++){
			if(val[i]._id){
				dealRecipeIdAry.push(val[i]._id);
			}
			else{
				isValReasonable = false;
			}
		}
		
		if(isValReasonable){
			res.locals.runningOrder.dealrecipe = dealRecipeIdAry;
			dbfunc.updateById(Dealterm, res.locals.runningOrder._id, res.locals.runningOrder).then(()=>{
				console.log("dealterm is updeted...");
		    	next();
	        }).catch((e)=>{
	        	res.send(e + stu);
	        });
		}
		else{
			res.send("dealrecipes created failed!" + stu);
		}	
		
	});
};



middleware.passItemToUser = function(req, res, next){
	var stu = "......@passItemToUser";
	
	var dealtermValue = 0
	
	for(var i=0; i<res.locals.userdata.shoppinglist.length; i++){
		var isUserOwn = false;
		for(var j=0; j<res.locals.userdata.treasures.length; j++){
			if(res.locals.userdata.treasures[j].id.toString() === res.locals.userdata.shoppinglist[i].id.toString()){
				isUserOwn = true;
				res.locals.userdata.treasures[j].qty += res.locals.userdata.shoppinglist[i].qty;
				dealtermValue += res.locals.userdata.shoppinglist[i].qty*
					res.locals.userdata.shoppinglist[i].property.price;
			}
		}
		if (!isUserOwn){
			var newOwn = {
			    id:	res.locals.userdata.shoppinglist[i].id,
				qty: Number(res.locals.userdata.shoppinglist[i].qty)
			};
			res.locals.userdata.treasures.push(newOwn);
			dealtermValue += res.locals.userdata.shoppinglist[i].qty*
					res.locals.userdata.shoppinglist[i].property.price;
		}
	}
    
	
	if(dealtermValue === res.locals.runningOrder.price){
		next();
	}
	else{
		res.send("not equal value!!!" + stu);
	}
	
};



middleware.chargeUser = function(req, res, next){
	var stu = "......@chargeUser";
	res.locals.userdata.cash -= res.locals.runningOrder.price;
	next();
};



middleware.finishOrder = function(req, res, next){
	var stu = "......@finishOrder";
	
	var isAlldone = true;
	
	Dealterm.findOne({_id: res.locals.runningOrder._id}).populate("dealrecipe").exec(function(err, found){
	    if (err) {
	    	console.log(err);
			res.send("runningOrder found error!");
	    }
	    else {
			
			if(found.dealrecipe.length == res.locals.userdata.shoppinglist.length){
			    res.locals.userdata.shoppinglist = [];
				dbfunc.updateById(User, req.user._id, res.locals.userdata).then(()=>{
                	next();
                }).catch((e)=>{
                	res.send(e + stu);
                });
			}
			else{
				res.send("wrong length" + stu);
			}

	    }
	});
};








middleware.updateUser = function(req, res, next){
	var stu = "......@updateUser";
	
	dbfunc.findById(User, req.user._id).then(
	     (resolve, reject)=>{
			resolve.nickname = req.body.user.nickname;
			resolve.desc = req.body.user.desc;
			
			dbfunc.updateById(User, req.user._id, resolve).then(()=>{
		        next();
	        }).catch((e)=>{
	        	res.send(e + stu);
	        });

		}
	 ).catch((e)=>{
	 	res.send(e + stu);
	 });
};


	
	    






middleware.isStockOut = function(req, res, next){
	var stu = "......@isStockOut";
	
	Treasure.find({}, function(err, tsFounds){
		
		var isNeedSupply = false;
		
		
		for(var i=0; i<tsFounds.length; i++){
			if(tsFounds[i].stocks <= 3){

				if(tsFounds[i].category === "SUR"){

				}
				else{
                    isNeedSupply = true;
				    break;
				}
				
			}
		}
		
		if(isNeedSupply){
			res.locals.tsFounds = tsFounds;
			next();
		}
		else{
			res.send("stocks are all enough..." + stu);
		}
		   
	});
}
	
	
	
	
	
	
	
	
	
middleware.replenishment = function(req, res, next){
	var stu = "......@replenishment";
	var AryGottenData = [];
	var AryPromised = [];   
	
	for(var i=0; i<res.locals.tsFounds.length; i++){
		
		if(res.locals.tsFounds[i].category === "SUR"){

		}
		else{
            res.locals.tsFounds[i].stocks = 99;
		}
		
		AryGottenData.push(dbfunc.updateById(Treasure, res.locals.tsFounds[i]._id, res.locals.tsFounds[i]));
		//catch become a resolve for Promise.all
		AryPromised.push(
			AryGottenData[i].then(dbfunc.promisePasser).catch(dbfunc.promisePasser)
		);
	}
	
	//promise.all would catched by just A catch...
	Promise.all(AryPromised).then((val)=>{
		
		console.log("all replenishment done");
		//val would be a array including each AryPromised promised
		
		
		var isAllDone = true;
		var updateErrMesg = "";
		
		for(var i=0; i <val.length; i++){
			if(val[i] === "database update error"){
				updateErrMesg = "database update error in [" + i + "]" + stu;
				console.log(updateErrMesg);
				isAllDone = false;
			}
		}
		
		if(isAllDone){
			next();
		}
	});

};





middleware.findUser = function(req, res, next){
	var stu = "......@findUser";
	dbfunc.findById(User, req.user._id).then((resolve)=>{
		res.locals.userdata = resolve;
		next();
	}).catch((e)=>{
        res.send(e + stu);
	});
}


middleware.findUser = function(req, res, next){
	var stu = "......@findUser";
	dbfunc.findById(User, req.user._id).then((resolve)=>{
		res.locals.foundUser = resolve;
		next();
	}).catch((e)=>{
        res.send(e + stu);
	});
}

middleware.findAllTreasures = function(req, res, next){
	var stu = "......@findAllTreasures";
	dbfunc.findsByProp(Treasure, {}).then((resolve)=>{
		res.locals.foundAllTreasures = resolve;
		next();
	}).catch((e)=>{
        res.send(e + stu);
	});
}


middleware.findUserArticles = function(req, res, next){
	var stu = "......@findUserArticles";
	dbfunc.findsByProp(Article, {authorid: req.user._id}).then((resolve)=>{
		res.locals.foundUserArticles = resolve;
		next();
	}).catch((e)=>{
        res.send(e + stu);
	});
}

middleware.findUserDeallogs = function(req, res, next){
	var stu = "......@findUserDeallogs";
	Dealterm.find({ownerid: req.user._id}).populate("dealrecipe").exec((err, founds)=>{
        if(err){
		    res.send(err + stu);
		}
		else{
			res.locals.foundUserDeallogs = founds;
			next();
		}
	});
}











// function
//
//
function isNumsEqual(num1, num2){
	return ((Math.abs(num1 - num2) < 0.001) ? true : false);
}




function seedData(el){
    return new Promise(function(resolve, reject){
		el.save(function (err, ele){
            if(err){
                reject(err);
            }
			console.log(ele + "...added...");
            resolve(el);
        });
	});
};











module.exports = middleware;