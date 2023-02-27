
var dbfunc = require("./dbfunc");
var apiCWB = require("../services/api/apicwb");
var rollCall = require("../services/schedule/rollcall");


var Event = require("./event");
var User = require("./user");
var Treasure = require("./treasure");

var eventfunc = {};

// initialize
apiCWB.init();
apiCWB.getCWBData().catch((e)=>{
	apiCWB.failCounts = 999; //if not setted, apiCWB.data would be null to render
	console.log("[api_CWB]init CWB api fail, set failCounts:999...");
});
rollCall.init();   //collision with robot!!!!!!





// function
//
//
eventfunc.find = function(req, res, next){
    var stu = "......@find";
	dbfunc.findById(Event, req.params.id).then(
	    (resolve, reject)=>{
			res.locals.running_event = resolve["_doc"];
			next();
		}
	).catch((e)=>{
		res.send("can't find the event:" + e + stu);
	});
};



eventfunc.eventPrepare = function(req, res, next){
	var stu = "......@eventPrepare";
	var eid = "e" + res.locals.running_event.eid
	switch(eid){
		case "e0101":
			apiCWB.chkNeedReq();
			apiCWB.sendReq().then((resolve)=>{
				res.locals.running_event.isSuc = true;
				res.locals.running_event.result = resolve;
				next();
			}).catch((e)=>{
				res.locals.running_event.isSuc = false;
				res.locals.running_event.result = e;
				next();
			});
			break;
		case "e1002":
			res.locals.rollCallNextTime = rollCall.nextTime;
			res.locals.running_event.isSuc = true;	
			next();
			break;
		default:
			res.locals.running_event.isSuc = true;	
		    next();
	}
};



eventfunc.isUidFinish = function(req, res, next){
    var stu = "......@isUidFinish";
	dbfunc.findById(User, req.user._id).then(
	    (resolve, reject)=>{
			res.locals.running_event.user = resolve["_doc"];
			var uidfinished = false;
			
			for(var i=0; i<res.locals.running_event.finish_uid.length; i++){
				if(res.locals.running_event.finish_uid[i].toString() === req.user._id.toString()){
					uidfinished = true;
					break;
				}
			}
			
			if(uidfinished){
				res.send("you finished the event!!!" + stu);
			}
			else{
				next();
			}
			
		}
	).catch((e)=>{
		res.send(e + stu);
	});
};




eventfunc.logic = function(req, res, next){
    var stu = "......@logic";
	
	var eid = "e" + res.locals.running_event.eid
	var logicFunFound = true;
	var tmp_event;  //which lets res get the pop of a obj
	var p;

	switch (eid) {
        case "e0001":
			p = eventfunc.logic["e0001"](req, res).then((val)=>{tmp_event = val});
            break;
		case "e0002":
			p = eventfunc.logic["e0002"](req, res).then((val)=>{tmp_event = val});
			break;
		case "e0101":
			p = eventfunc.logic["e0101"](req, res).then((val)=>{tmp_event = val});
			break;
		case "e1001":
			p = eventfunc.logic["e1001"](req, res).then((val)=>{tmp_event = val});
			break;
		case "e1002":
			p = eventfunc.logic["e1002"](req, res).then((val)=>{tmp_event = val});
            break;
        default:
            p = Promise.resolve().then(()=>{logicFunFound = false});
	}
	
	p.then(()=>{
        if(logicFunFound){
			res.locals.running_event = tmp_event;
			
			if(res.locals.running_event.isSuc){
				next();
			}
			else{
				var result = "something wrong in event...because:";
				result += res.locals.running_event.result
				res.send( result + stu);
			}
		}
		else{
			res.send("event is not valid" + stu);
		}
	}).catch((e)=>{
		res.send("event logic function error..." + stu);
	});
	
	
};





eventfunc.sendReward = function(req, res, next){
    var stu = "......@sendReward";
	
	if(res.locals.running_event.reward_cash){
		res.locals.running_event.user.cash += res.locals.running_event.reward_cash;
	}
	
	if(res.locals.running_event.reward_treasure){
		
		var AryGottenData = [];
		var AryPromised = [];	

		for(var i=0; i<res.locals.running_event.reward_treasure.length; i++){
	    	var isUserOwn = false;
	    	for(var j=0; j<res.locals.running_event.user.treasures.length; j++){
	    		if(res.locals.running_event.user.treasures[j].id.toString() === res.locals.running_event.reward_treasure[i].id.toString()){
	    			isUserOwn = true;
	    			res.locals.running_event.user.treasures[j].qty += res.locals.running_event.reward_treasure[i].qty;
	    		}
	    	}
	    	if (!isUserOwn){
				AryGottenData.push(dbfunc.findsByProp(Treasure,
					{id: res.locals.running_event.reward_treasure[i].id.toString()}));
				
				AryPromised.push(
					AryGottenData[i].then(dbfunc.promisePasser).catch(dbfunc.promisePasser)
				);
	    	}
		}
		
		//promise.all would catched by just A catch...
        Promise.all(AryPromised).then((val)=>{
			
	        var isValReasonable = true;
	        //val would be a array including each AryPromised promised
	        for(var i=0; i <AryPromised.length; i++){
                
		        if(val[i] === "database find error"){
					isValReasonable = false;
					break;
				}
                if(val[i].length != 1){
					isValReasonable = false;
					break;
				}
				if(!val[i][0]._id){
					isValReasonable = false;
					break;
				}
	        }
	
	        if(isValReasonable){

				for(var i=0; i <AryPromised.length; i++){
					var newOwn = {
						id:	val[i][0]._id,
						qty: Number(res.locals.running_event.reward_treasure[i].qty)
					};
					res.locals.running_event.user.treasures.push(newOwn);
				}

				dbfunc.updateById(User, req.user._id, res.locals.running_event.user).then(()=>{
					next();
				}).catch((e)=>{
					res.send(e + stu);
				});
	        }
	        else{
	        	res.send("event's treasures found failed!" + stu);
	        }
	
        });

	}
	else{
		dbfunc.updateById(User, req.user._id, res.locals.running_event.user).then(()=>{
			next();
		}).catch((e)=>{
			res.send(e + stu);
		});
	}
};


eventfunc.finish = function(req, res, next){
    var stu = "......@finish";
	
	var uid = req.user._id.toString();
	
	res.locals.running_event.finish_uid.push(uid);

	dbfunc.updateById(Event, req.params.id, res.locals.running_event).then(()=>{
    	next();
    }).catch((e)=>{
    	res.send(e + stu);
    });

};












//each events' logic
//
//
//user's desc event
eventfunc.logic.e0001 = function(req, res){
	return new Promise((resolve, reject)=>{
        var keyobj = ""; //alway check the valve exist first!
	
		if(res.locals.running_event.user.desc){
			keyobj = res.locals.running_event.user.desc;
		} 
	
		if(keyobj.length>=5){
			res.locals.running_event.isSuc = true;
		}
		else{
			res.locals.running_event.isSuc = false;
			res.locals.running_event.result = "your desc is less than 5!!!"
		}
		resolve(res.locals.running_event);
	});
}

//user's article event
eventfunc.logic.e0002 = function(req, res){
	return new Promise((resolve, reject)=>{
        var keyobj = []; //alway check the valve exist first!
	
		if(res.locals.running_event.user.articles){
			keyobj = res.locals.running_event.user.articles;
		} 
	
		if(keyobj.length>=1){
			res.locals.running_event.isSuc = true;
		}
		else{
			res.locals.running_event.isSuc = false;
			res.locals.running_event.result = "nothing in your articles!!!"
		}
		resolve(res.locals.running_event);
	});
}

//cwb api event
eventfunc.logic.e0101 = function(req, res){
	return new Promise((resolve, reject)=>{
        var keyobj = 999; //alway check the valve exist first!
	    if(req.body.eventData.value0){
	    	keyobj = req.body.eventData.value0;
		}

	    apiCWB.chkNeedReq();
	    apiCWB.sendReq().then((val)=>{
	    	if(keyobj.toString() === val["records"]["location"][0]["weatherElement"][2]["time"][0]["parameter"]["parameterName"].toString()){
				res.locals.running_event.isSuc = true;
			}
			else{
				res.locals.running_event.isSuc = false;
				res.locals.running_event.result = "your value didn't match"
			}
			resolve(res.locals.running_event);
		}).catch((e)=>{
			res.locals.running_event.isSuc = false;
			res.locals.running_event.result = e;
			resolve(res.locals.running_event);
		});
		
	});
}



//nine gift after login
eventfunc.logic.e1001 = function(req, res){
	return new Promise((resolve, reject)=>{
		var keyobj = ""; //alway check the valve exist first!
		if(req.user._id){
			keyobj = req.user._id.toString();
		} 

		if(keyobj.length > 0){
			res.locals.running_event.isSuc = true;
		}
		else{
			res.locals.running_event.isSuc = false;
			res.locals.running_event.result = "user is not valid";
		}
		resolve(res.locals.running_event);
	});
}

//sample event
eventfunc.logic.e1002 = function(req, res){
	return new Promise((resolve, reject)=>{
		var keyobj = ""; //alway check the valve exist first!
		if(req.user._id){
			keyobj = req.user._id.toString();
		} 

		if(keyobj.length > 0){
			res.locals.running_event.isSuc = true;
		}
		else{
			res.locals.running_event.isSuc = false;
			res.locals.running_event.result = "user is not valid";
		}
		resolve(res.locals.running_event);
	});
}


//sample event
eventfunc.logic.e0000 = function(req, res){
	return new Promise((resolve, reject)=>{
		var keyobj = {}; //alway check the valve exist first!
		var src = {}
		if(src){
			keyobj = src;
		} 

		var condition;
		if(condition){
			res.locals.running_event.isSuc = true;
		}
		else{
			res.locals.running_event.isSuc = false;
			res.locals.running_event.result = "fail reason"
		}
		resolve(res.locals.running_event);
	});
}



module.exports = eventfunc;