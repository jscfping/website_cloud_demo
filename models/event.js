

var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
	eid: String,
	name: String,
	description: String,
	created: {type: Date, default: Date.now},
	date_start: Date,
	date_end: Date,
	isrunning: Boolean,
	finish_uid: [{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "User"
	}],
	reward_cash: Number,
	reward_treasure:[{
			id: String,
			qty: Number
		}]
});


module.exports = mongoose.model("Event", eventSchema);