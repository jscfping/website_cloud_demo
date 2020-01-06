

var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
    title: String,
	description: String,
	authorid:{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "User"
	},
	created: {type:Date, default:Date.now},
	isedited: {type:Boolean, default:false},
	edited: Date,
    comments: [
		{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "ArticleComment"
        }
	]
});


module.exports = mongoose.model("Article", articleSchema);