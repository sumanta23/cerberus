var paramType          = require("@sumanta23/server-wrapper").paramTypes;
var serviceHandler     = require("@sumanta23/server-wrapper").serviceHandler;

var Promise            = require('bluebird');
var _                  = require('lodash');

module.exports.getHealth = function(req, res) {
    var healthP = Promise.resolve({'status':'OK'})
	serviceHandler(req, res, healthP);
};

module.exports.url_prefix = "/api" ;
module.exports.getMappings = function() {
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