var config = require("../config");
var dbfunc = require("../dbfunc");
var Event = require("../event");
var rollCall = {};
var counts;



//rollCall function
//
//
rollCall.init = function(){
	counts = 0;
	rollCall.tmr();
}

rollCall.tmr = function(){
	rollCall.newRound().then(()=>{
		var nowTime = new Date();
		var latermilliSecs = getNextmilliSecs(nowTime, config.event.rollCall.intervalSec);
		rollCall.nextTime = new Date(nowTime.getTime()+latermilliSecs);
		console.log(nowTime + "[" + counts + "]rollCall reset Suc");
		setTimeout(rollCall.tmr, latermilliSecs);
		counts++;
	}).catch((e)=>{
		var nowTime = new Date();
		var latermilliSecs = getNextmilliSecs(nowTime, config.event.rollCall.intervalSec);
		rollCall.nextTime = new Date(nowTime.getTime()+latermilliSecs);
		console.log(nowTime + "[" + counts + "]rollCall reset fail:");
		console.log(e);
		setTimeout(rollCall.tmr, latermilliSecs);
		counts++;
	});
}


rollCall.newRound = function(){
	return new Promise((resolve, reject)=>{
		Event.findOne({eid: "1002"}, function(err, found){
			if(err){
				reject(err);
			}
			else {
				if(found){
				    found.finish_uid = [];
				    Event.updateOne({_id: found._id}, found, function(err, sign){
				    	if(err){
					    	reject(err);
					    }
					    else{
					    	resolve();
					    }	
					});
				}
				else{
					reject("not found rollcall event");
				}
				
			}	
		});
	});
}




// function
//
//
function getNextmilliSecs(nowTime, intervalSec){
	//this cals from 2020.1.1.00.00.00.000(1577808000000)
	var interval = intervalSec * 1000 //ms
	var ans = interval-(nowTime-1577808000000)%interval; //ms
	return ans;
}




module.exports = rollCall;