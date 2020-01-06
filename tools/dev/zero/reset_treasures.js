var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/cloud_demo", {useNewUrlParser: true});


var Treasure = require("../../../models/treasure");


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
	    isrecommend: true
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
	    category: "word"
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
	    isrecommend: true
    }),
	new Treasure({
	    id: 9,
	    name: "金句良言0",
        image: "/images/treasures/images/str_00.png",
	    description: "原來如此！要好好緊記在心！時時督促自己~~",
	    category: "string"
    }),
	new Treasure({
	    id: 10,
	    name: "金句良言1",
        image: "/images/treasures/images/str_01.png",
	    description: "又上了一課呢~~~感謝英國的努力www",
	    category: "string"
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

var sequence = Promise.resolve();



Treasure.deleteMany({}, function(err){
    if (err) {
    	console.log(err);
    }
    else {
        console.log("...CLEAR!");
		// Loop through our chapter urls
        treasuresAry.forEach(function(el){
            // Add these actions to the end of the sequence
            sequence = sequence.then(function(){
                return seedData(el); //if then(seedDate(el)) would run in this line, return would be submit
            });
        });
		
    }
});




