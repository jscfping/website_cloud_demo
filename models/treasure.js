

var mongoose = require("mongoose");

var treasureSchema = new mongoose.Schema({
    id: Number,
	name: String,
	image: String,
	description: String,
	category: String,
	price: {type: Number, default: 99, min: 0},
	ownercount: {type: Number, default: 0},
	issold: {type: Boolean, default: true},
	releasedate: {type: Date, default: Date.now},
	isrecommend: {type: Boolean, default: false},
	ishotsold: {type: Boolean, default: false},
	stocks: {type: Number, default: 99, min: 0},
    comments: [
		{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "ArticleComment"
        }
	]
});


module.exports = mongoose.model("Treasures", treasureSchema);


// category:"userimage", "string", "word"