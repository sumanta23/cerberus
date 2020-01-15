var paramType          = require("common-wrapper").paramTypes;
var serviceHandler     = require("common-wrapper").serviceHandler;
let BaseRest           = require("common-wrapper").BaseRest;

var Promise            = require('bluebird');
var _                  = require('lodash');
var Logger             = require("applogger-wrapper").Logger;


class Health extends BaseRest {

	constructor(url_prefix="/api"){
		super();
		this.url_prefix = url_prefix;
	}


	getHealth(req, res) {
		this.logger.info("jeeeee");
		var healthP = Promise.resolve({'status':'OK'});
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
		};

	}
}

module.exports = Health;
