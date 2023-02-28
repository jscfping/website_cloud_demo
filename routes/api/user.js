
const express = require("express");
const router = express.Router({ mergeParams: true });

const middleware = require("../../models/middleware");
var Event = require("../../models/event");


class APIUser {
    constructor({ passport }) {
        this._passport = () => passport();
    }

    get prePath() {
        return "/api/users";
    }

    exportRouter() {
        const that = this;

        router.get("/", (req, res) => {
            res.json({ message: `hello, ${req.query.u}!` });
        });

        router.post("/",
            middleware.register(),
            function (req, res) {
                that._passport().authenticate("local")(req, res, function () {
                    Event.findOne({ eid: "1001" }, (err, found) => {
                        if (err) {
                            res.json({ goto: `/` });
                        }
                        else {
                            res.json({ goto: `/events/${found._id}` });
                        }
                    })

                });
            }
        );
        return router;
    }


}




module.exports = APIUser;