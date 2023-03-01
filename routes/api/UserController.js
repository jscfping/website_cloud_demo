
const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../../models/middleware");


class UserController {
    constructor(aServiceProvider) {
        this._serviceProvider = aServiceProvider;
    }

    get prePath() {
        return "/api/users";
    }

    getAPIUser() {
        return this._serviceProvider.createScope().getService("APIUser");
    }

    exportRouter() {
        const that = this;

        router.get("/", (req, res) => {
            res.json(that.getAPIUser().getHello(req.query.u));
        });

        router.post("/",
            middleware.register(),
            function (req, res) {
                that.getAPIUser().addUserAsync(req, res)
                    .then(goTo => {
                        res.json({ goto: goTo });
                    }).catch(err => {
                        res.json({ goto: `/` });
                    });
            }
        );
        return router;
    }


}

module.exports = UserController;