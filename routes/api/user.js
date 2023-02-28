
const express = require("express");
const router = express.Router({ mergeParams: true });



router.get("/", (req, res) => {
    res.json({ message: `hello, ${req.query.u}!` });
});

module.exports = {
    prePath: "/api/users",
    router
};