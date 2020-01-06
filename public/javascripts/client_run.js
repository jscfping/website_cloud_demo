UTCtoLocalTime();


function UTCtoLocalTime(){
	//handling UTC tag's string
    document.querySelectorAll("UTC").forEach(function(el){
    	var elnum = Number(el.textContent);
    	if(elnum){
    		var utctime = new Date(elnum);
    	    el.textContent = utctime.toLocaleString() + rtnGMT();
    	}
    });
}

function rtnGMT(){
	var ans = "(GMT";
	var gmt = new Date();
    gmt = gmt.getTimezoneOffset()/(-60);
    if(gmt>=0){
    	ans = ans + "+" + gmt.toString();
    }
    else{
        ans = ans + gmt.toString();
    }
	ans = ans +")";
	return ans;
}

function apiGetAllTreasuresInfo(){
	var itemAry = document.querySelectorAll("shoppinglistitem");
	itemAry.forEach(function(el){
		apiGetOneTreasureInfo(el);
	});
}

function apiGetOneTreasureInfo(el){
	var requestURL = "http://lyppp.run-us-west1.goorm.io/api/treasures/" + el.textContent;
	var request = new XMLHttpRequest();
	request.open("GET", requestURL);
    request.responseType = "json";
    request.send();
	request.onload = function() {
	    var res = request.response;
		el.innerHTML = 
			"<img src=\"" + res["image"] + "\">" +
			"商品名稱:" + res["name"] +
			", 描述:" + res["description"] +
			", 價格:" + res["price"];
	}
}


