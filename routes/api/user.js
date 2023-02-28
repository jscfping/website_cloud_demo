
const express = require("express");
const router = express.Router({ mergeParams: true });

const middleware = require("../../models/middleware");



class APIUser {
    constructor({ passport }) {
        this._passport = () => passport();
    }

    get prePath() {
        return "/api/users";
    }

    exportRouter() {
        router.get("/", (req, res) => {
            res.json({ message: `hello, ${req.query.u}!` });
        });

        router.post("/",
            middleware.register(),
            function (req, res) {
                //http://www.passportjs.org/docs/authenticate/
                //JS' closure
                this._passport().authenticate("local")(req, res, function () {


                    res.json({ message: `registered.` });

                    // Event.findOne({ eid: "1001" }, (err, found) => {
                    //     if (err) {
                    //         res.send("not find event page...");
                    //     }
                    //     else {
                    //         res.redirect("/events/" + found._id);
                    //     }
                    // })

                });
            }
        );
        return router;
    }


}




module.exports = APIUser;