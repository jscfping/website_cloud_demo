//this is a sample to test node express' middle's closure function

var express = require("express");
var app = express();


var middle= {};


middle.test = function(x,y){
    return (req, res, next)=>{
        res.locals.val = x+y;
        next();
    };
}


app.get("/",
    middle.test("Hello", "Moto?"),
    (req, res, next)=>{
    res.send("val:" + res.locals.val);
})



app.listen(3000, function(){
    console.log("The Server Has Started...");
 });