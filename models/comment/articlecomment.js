

var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
	description: String,
	authorid:{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "User"
    },
	created: {type:Date, default:Date.now},
	isedited: {type:Boolean, default:false},
	edited: Date
	
});


module.exports = mongoose.model("ArticleComment", articleSchema);