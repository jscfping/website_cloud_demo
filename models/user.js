
/*mongooseSchema's data type

name: String,
living: Boolean,
age: {type: Number, min: 18, max: 100},
updated: {type: Date, default: Date.now},
*/

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true
    },
    password: String,
	created: {type:Date, default:Date.now},
	lastlogin: Date,
	nickname: String,
	desc: String,
	age: {type: Number, min: 6, max: 100},
	cash: {type: Number, min: 0, default:0},
	location: String,
	shoppinglist: [
		{   //maybe it would be a shoppinglist schema???
			// _id: mongoose.objId would be created here
			id: {
				type: mongoose.Schema.Types.ObjectId, // here, when i push sth in this array, i would get created _id in this object. can be better???
		        ref: "Treasure" // where ref is Treasure of mongoose.model("Treasure", treasureSchema), which means db's collections;
			},
			qty: {type: Number, min: 0}
        }
	],
	deallog: [
		{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "Dealterm"
        }
	],
	treasures: [
	    {
	        id: {
		        type: mongoose.Schema.Types.ObjectId,
		        ref: "Treasure"
            },
			qty: {type: Number, min: 0}
		}
	],
	articles: [
		{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "Article"
        }
	],
	friends: [
		{
		    type: mongoose.Schema.Types.ObjectId,
		    ref: "User"
        }
	]
	
});


userSchema.plugin(passportLocalMongoose);


//FORADEMOs, in the end, the MONGO would AUTO help to lowercasize and add 's' in the end of the string if there is no s
//forsample -> forsamples
//FORADEMOs => fordemos
module.exports = mongoose.model("User", userSchema);