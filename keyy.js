
// NOTICE:
// this key file uses fake key to run server,
// but when you use api function, it would be fail for fake key.
// you can make ./keyyy.js model to import (it would be ignore by git).
// or replace these with real keys in this file directly.
// but BE CAREFUL for git commit your real keys.



var keyy = {};

keyy.cwbkey = "123";


try{
    var keyyy = require("./keyyy");
    keyy.cwbkey = keyyy.cwbkey;

    console.log("use true api key===>");
}
catch(e){
    console.log("true key:" + e.code + ", so use fake api key===>");
}


module.exports = keyy;