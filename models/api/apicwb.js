var request = require("request");


var keyy = require("../../keyy");
var apiCWB = {};
var url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=" +
    keyy.cwbkey +
	"&format=JSON&locationName=%E8%87%BA%E4%B8%AD%E5%B8%82&elementName=Wx,PoP,CI,MinT,MaxT";




//apiCWB function
//
//
apiCWB.init = function(){
	var nowTime = getPassedTime();
	apiCWB.passedDay = nowTime.passedDay;
	apiCWB.passedDayQuarter = nowTime.passedDayQuarter;
	apiCWB.data = null;
	apiCWB.isNeedReq = true;
	apiCWB.failCounts = 0;
}


apiCWB.chkNeedReq = function(){
	var nowTime = getPassedTime();

	if(nowTime.passedDay > apiCWB.passedDay){
		apiCWB.passedDay = nowTime.passedDay;
		apiCWB.passedDayQuarter = nowTime.passedDayQuarter;
		apiCWB.isNeedReq = true;
	}
	else if(nowTime.passedDayQuarter > apiCWB.passedDayQuarter){
		apiCWB.passedDayQuarter = nowTime.passedDayQuarter;
		apiCWB.isNeedReq = true;
	}else{
		apiCWB.isNeedReq = false;
	}
}


apiCWB.sendReq = function(){
    return new Promise((resolve, reject)=>{
		if(apiCWB.failCounts>15){
			reject("[api_CWB]CWB api now failed (>15 times)...");
		}
		else{
			if(apiCWB.isNeedReq){
				apiCWB.getCWBData().then((res)=>{
					apiCWB.failCounts = 0;
					resolve(res);
				}).catch((e)=>{
					apiCWB.failCounts++;
	                reject(e);
				});
			}
			else{
				resolve(apiCWB.data);
			}
		}
	});
}


apiCWB.getCWBData = function(){
	return new Promise((resolve, reject)=>{
		console.log("[api_CWB]send a request to CWB...");
		console.log("[api_CWB]day:" + apiCWB.passedDay + ", quarter" + apiCWB.passedDayQuarter)

		request(url, function(error, response, body){
			
			if(error){
				console.log("[api_CWB]CWB api error:");
				console.log(error);
				reject(error);

			}else if(response.statusCode != 200){
				var errCode = "[api_CWB]" + "CWB api error stat code:" + response.statusCode;
				console.log(errCode);
				reject(errCode);
			}else{
				console.log("[api_CWB]get respond from CWB...");
				apiCWB.data = JSON.parse(body);
				resolve(apiCWB.data);
			}

		});
	});
};




// function
//
//
function getPassedTime(){
	//this cals from 2020/1/1
	var ans = {};
	var nowTime = new Date();
	var passed = (nowTime-1577808000000)/86400000;
	ans.passedDay = Math.floor(passed);
	ans.passedDayQuarter = passed - ans.passedDay;

	if(ans.passedDayQuarter<0.25){
		ans.passedDayQuarter = 0;
	}else if(ans.passedDayQuarter<0.5){
		ans.passedDayQuarter = 1;
	}else if(ans.passedDayQuarter<0.75){
		ans.passedDayQuarter = 2;
	}else{
		ans.passedDayQuarter = 3;
	}

	return ans;
}




module.exports = apiCWB;