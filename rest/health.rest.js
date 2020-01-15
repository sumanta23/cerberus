var paramType          = require("@sumanta23/server-wrapper").paramTypes;
var serviceHandler     = require("@sumanta23/server-wrapper").serviceHandler;
let BaseRest           = require("@sumanta23/server-wrapper").BaseRest;

var Promise            = require('bluebird');
var _                  = require('lodash');
var Logger             = require("applogger-wrapper").Logger;


class Health extends BaseRest {

	constructor(url_prefix="/api"){
		super()
		this.url_prefix = url_prefix;
	}


	getHealth(req, res) {
		this.logger.info("jeeeee");
		var healthP = Promise.resolve({'status':'OK'})
		serviceHandler(req, res, healthP);
	}

	getMappings() {
		return {
			'/health' : {
				get : {
					tags: ["Health"],
					summary: "Get health",
					callbacks : [this.getHealth],
				}
			}
		}

	};
}

module.exports = Health;
