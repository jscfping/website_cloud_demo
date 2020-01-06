var User = require("./user");
var Article = require("./article");
var Treasure = require("./treasure");
var Dealterm = require("./deallog/dealterm.js");
var Dealrecipe = require("./deallog/dealrecipe.js");

var dbfunc = {};


dbfunc.promisePasser = function(x){
	return new Promise((resolve, reject)=>{
		resolve(x);
	});
}



dbfunc.createBySha = function(newone){
	return new Promise(function(resolve, reject){
		newone.save(function (err, newone){
            if(err){
				console.log(err);
				reject("database save error");
			}
			else{
				resolve(newone);
			}	
        });
	});
};





dbfunc.findById = function(objSchema, _id){
	return new Promise(function(resolve, reject){
		objSchema.findOne({_id: _id}, function(err, found){
		    if(err){
				console.log(err);
				reject("database find error");
			}
			else{
				resolve(found);
			}	
		});
	});
};



dbfunc.updateById = function(objSchema, _id, renew){
	return new Promise(function(resolve, reject){
		objSchema.updateOne({_id: _id}, renew, function(err, sign){
		    if(err){
				console.log(err);
				reject("database update error");
			}
			else{
				resolve(sign);
			}	
		});
	});
};


dbfunc.findsByProp = function(objSchema, prop){
	return new Promise(function(resolve, reject){
		objSchema.find(prop, function(err, found){
		    if(err){
				console.log(err);
				reject("database find error");
			}
			else{
				resolve(found);
			}	
		});
	});
};






module.exports = dbfunc;



