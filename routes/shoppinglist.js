
var express = require("express");
var router  = express.Router({mergeParams: true});

var middleware = require("../models/middleware");

//show shoppinglist
router.get("/",
	middleware.isLogIned,
	middleware.getShoppingListRecipe,
	function(req, res){
	    res.render("users/shoppinglist");
});

//shopping list add function
router.put("/:id",
	middleware.isLogIned,
	middleware.chkMarketOffReq,
	middleware.marketOff,
	middleware.shopListIn,
	function(req, res){
	    res.redirect("/shoppinglist");
});

//shopping list pop function
router.delete("/:id",
	middleware.isLogIned,
	middleware.chkShopListOutReq,
    middleware.shopListOut,
    middleware.marketOn,
	function(req, res){
	    res.redirect("/shoppinglist");
});


module.exports = router;