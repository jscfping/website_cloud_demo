var Event = require("../../models/event");



class APIUser {
    constructor({ passport }) {
        this._passport = () => passport();
    }


    getHello(userName) {
        return { message: `hello, ${userName}!` };
    }


    addUserAsync(req, res) {
        return new Promise((resolve, reject) => {
            this._passport().authenticate("local")(req, res, function () {
                Event.findOne({ eid: "1001" }, (err, found) => {
                    if (err) reject(err);
                    resolve(`/events/${found._id}`);
                });
            });
        });
    }
}




module.exports = APIUser;