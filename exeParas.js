

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	executingPort: process.env.executingPort,
	apiCWBKey: process.env.apiCWBKey,
	mongoDBConnectString: process.env.mongoDBConnectString
};