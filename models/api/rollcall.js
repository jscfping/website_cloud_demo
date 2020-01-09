var config = require("../config");
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
	rollCall.newRound();
	var nowTime = new Date();
	var latermilliSecs = getNextmilliSecs(nowTime, config.event.rollCall.intervalSec);
	rollCall.nextTime = new Date(nowTime.getTime()+latermilliSecs);
	console.log(nowTime + "[" + counts + "] rollCall event reset>>>");
	setTimeout(rollCall.tmr, latermilliSecs);
	counts++;
}


rollCall.newRound = function(){
    rollCall.attended = [];
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