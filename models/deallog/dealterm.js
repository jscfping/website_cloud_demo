var mongoose = require("mongoose");

var dealtermSchema = new mongoose.Schema({
	ownerid:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    dealrecipe:[
		{
		    type: mongoose.Schema.Types.ObjectId,
            ref: "Dealrecipe"
        }   
    ],
	date: {type:Date, default:Date.now},
	price: {type: Number, min: 0}
});


module.exports = mongoose.model("Dealterm", dealtermSchema);

