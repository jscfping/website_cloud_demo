var reset_rebot = {};
var config = require("./config");

var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var User = require("./user");
var Article = require("./article");
var Treasure = require("./treasure");
var Event = require("./event");
var Dealterm = require("./deallog/dealrecipe");
var Dealrecipe = require("./deallog/dealterm");






function seedData(el){
    return new Promise(function(resolve, reject){
		el.save(function (err, ele){
            if(err){
                reject(err);
			}
			if(config.autoResetIsShown){
				console.log(ele + "...added...");
			}
            resolve(el);
        });
	});
};




//yes, this is stupid...would rebase it and init.js
function reset(){
    return new Promise((resetResolve, resetReject)=>{


promiseOrder = Promise.resolve(); //used to all
sequence = Promise.resolve(); //used to add


//IT would be assigned in this function every time,
//or mongoose would see these are the SAMES to save error
var treasuresAry = [
	new Treasure({
	    id: 1,
	    name: "高興每一天",
        image: "/images/userimages/happy.png",
	    description: "每天都笑嘻嘻~~",
	    category: "userimage",
	    price: 20
    }),
	new Treasure({
	    id: 2,
	    name: "笑而不答",
        image: "/images/userimages/pa.png",
	    description: "怕!?",
	    category: "userimage",
		price: 10
    }),
	new Treasure({
	    id: 3,
	    name: "淡定",
        image: "/images/userimages/redtea.png",
	    description: "你要喝杯紅茶嗎.....?",
	    category: "userimage"
    }),
	new Treasure({
	    id: 4,
	    name: "愛",
        image: "/images/treasures/images/word_00.png",
	    description: "是動詞，也是名子",
	    category: "word",
	    ishotsold: true,
		isrecommend: true,
		price: 100
    }),
	new Treasure({
	    id: 5,
	    name: "平",
        image: "/images/treasures/images/word_01.png",
	    description: "代表和平、和順",
	    category: "word",
	    ishotsold: true,
	    price: 999
    }),
	new Treasure({
	    id: 6,
	    name: "家",
        image: "/images/treasures/images/word_02.png",
	    description: "一個傑出的書法字...",
	    category: "word",
		price: 300
    }),
	new Treasure({
	    id: 7,
	    name: "鳳",
        image: "/images/treasures/images/word_03.png",
	    description: "一個傑出的書法字...",
	    category: "word"
    }),
	new Treasure({
	    id: 8,
	    name: "飛",
        image: "/images/treasures/images/word_04.png",
	    description: "一個傑出的書法字...",
	    category: "word",
	    isrecommend: true,
		price: 3
    }),
	new Treasure({
	    id: 9,
	    name: "金句良言0",
        image: "/images/treasures/images/str_00.png",
	    description: "原來如此！要好好緊記在心！時時督促自己~~",
	    category: "string",
		price: 87
    }),
	new Treasure({
	    id: 10,
	    name: "金句良言1",
        image: "/images/treasures/images/str_01.png",
	    description: "又上了一課呢~~~感謝英國的努力www",
	    category: "string",
		price: 66
    }),
	new Treasure({
	    id: 11,
	    name: "九星大禮",
        image: "/images/treasures/images/sur_00.png",
	    description: "傳說中的九星大禮？有錢還買不到？？？",
	    category: "SUR",
		stocks: 0,
		price: 4294967295
    })
	
];

var eventsAry = [
	new Event({
		eid: "0001",
		name: "Hi~Hi~",
	    description: "填寫個人描述，讓大家可以更認識你，以拿取$$~",
	    isrunning: true,
		reward_cash: 300
	}),
	new Event({
		eid: "0002",
		name: "第一則po文",
	    description: "po出你的第一則文章，展現你的文采，以拿取$$~",
	    isrunning: true,
		reward_cash: 500
    }),
	new Event({
		eid: "0101",
		name: "雲氣象",
	    description: "告訴本雲此預報API最低溫為多少，本雲會送一些些$$以答謝",
	    isrunning: true,
		reward_cash: 1000,
    }),
	// new Event({
	// 	eid: "0102",
	// 	name: "達成率萬分之一",
	//     description: "達成率萬分之一的挑戰，你！敢挑戰嗎？挑戰成功有豐富獎金~~~",
	//     isrunning: true,
	// 	reward_cash: 1000,
    // }),
	new Event({
		eid: "1001",
	    name: "註冊即送!",
	    description: "這Demo製作人瘋了！！！ 九星大禮註冊即送！？！",
	    isrunning: true,
		reward_treasure:[
			{
			    id: "11",
			    qty: 1
			},
		]
    })
	
];

//START TO RUN
//
//
//
//


promiseOrder = promiseOrder.then(()=>{
	return new Promise(
		(resolve, reject)=>{
			User.deleteMany({}, function(err){
				if (err) {
					reject(err);
				}
				else {
					console.log("users...CLEAR!");
					resolve();
				}
			});
		}
	)
});


promiseOrder = promiseOrder.then(()=>{
	return new Promise(
		(resolve, reject)=>{
			Article.deleteMany({}, function(err){
				if (err) {
					reject(err);
				}
				else {
					console.log("articles...CLEAR!");
					resolve();
				}
			});
		}
	)
});



promiseOrder = promiseOrder.then(()=>{
	return new Promise(
		(resolve, reject)=>{
			Dealterm.deleteMany({}, function(err){
				if (err) {
					reject(err);
				}
				else {
					console.log("dealterms...CLEAR!");
					resolve();
				}
			});
		}
	)
});


promiseOrder = promiseOrder.then(()=>{
	return new Promise(
		(resolve, reject)=>{
			Dealrecipe.deleteMany({}, function(err){
				if (err) {
					reject(err);
				}
				else {
					console.log("dealrecipes...CLEAR!");
					resolve();
				}
			});
		}
	)
});



promiseOrder = promiseOrder.then(()=>{
	return new Promise(
		(resolve, reject)=>{
			Treasure.deleteMany({}, function(err){
				if (err) {
					reject(err);
				}
				else {
					console.log("treasures...CLEAR!");
					// Loop through our chapter urls
					treasuresAry.forEach(function(el){
						// Add these actions to the end of the sequence
						sequence = sequence.then(function(){
							return seedData(el); //if then(seedDate(el)) would run in this line, return would be submit
						});
					});
					sequence.then(()=>{
						resolve();
					}).catch((e)=>{
						reject(e);
					});
				}
			});
		}
	)
});


promiseOrder = promiseOrder.then(()=>{
	return new Promise(
		(resolve, reject)=>{
			Event.deleteMany({},function(err){
				if (err) {
					reject(err);
				}
				else {
					console.log("events...CLEAR!");
					// Loop through our chapter urls
					eventsAry.forEach(function(el){
						// Add these actions to the end of the sequence
						sequence = sequence.then(function(){
							return seedData(el); //if then(seedDate(el)) would run in this line, return would be submit
						});
					});
					sequence.then(()=>{
						resolve();
					}).catch((e)=>{
						reject(e);
					});
				}
			});
		}
	)
});



promiseOrder.then(()=>{
    console.log("initialize complete...")
    resetResolve();
}).catch((e)=>{
	console.log("something wrong:")
    console.log(e);
    resetReject();
});



})
}




var counts = 0;

reset_rebot.tmr = function(){
	var nowTime = new Date();
	var latermilliSecs = getNextmilliSecs(nowTime, config.autoResetSecs);
	reset_rebot.nextTime = new Date(nowTime.getTime()+latermilliSecs);
	console.log(nowTime + ": reset>>>")
	counts++;
    reset().then(()=>{
        console.log(counts+"] reset done")
        setTimeout(reset_rebot.tmr, latermilliSecs);
    }).catch((e)=>{
        console.log(counts+"] reset fail")
        setTimeout(reset_rebot.tmr, latermilliSecs);
    });
    
}


function getNextmilliSecs(nowTime, intervalSec){
	//this cals from 2020.1.1.00.00.00.000(1577808000000)
	var interval = intervalSec * 1000 //ms
	var ans = interval-(nowTime-1577808000000)%interval; //ms
	return ans;
}


module.exports = reset_rebot;