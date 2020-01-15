var paramType          = require("@sumanta23/server-wrapper").paramTypes;
var serviceHandler     = require("@sumanta23/server-wrapper").serviceHandler;
var errors             = require("perror-wrapper");

var Promise            = require('bluebird');
var _                  = require('lodash');

var TopicService       = require("../services/Topic.js");

class Topics {

	constructor(url_prefix="/api"){
		this.url_prefix = url_prefix;
	}

	getTopics (req, res) {
		let TopicServiceInst = TopicService.getInst();
		if(!req.params.tenantId)
			return serviceHandler(req, res, new Promise.reject(new errors.BadRequest("tenantId missing")));
		serviceHandler(req, res, TopicServiceInst.getAllTopics(req.params.tenantId));
	}

	createTopic (req, res) {
		let TopicServiceInst = TopicService.getInst();
		if(!req.params.tenantId || req.params.tenantId!==req.body.tenantId)
			return serviceHandler(req, res, new Promise.reject(new errors.BadRequest("invalid tenantId")));
		serviceHandler(req, res, TopicServiceInst.createTopic(req.body));
	}

	getMappings () {
		return {
			'/:tenantId/topic' : {
				get : {
					tags: ["Topic"],
					summary: "Get all Topics",
					callbacks : [this.getTopics]
				},
				post :{
					tags: ["Topic"],
					summary: "create Topics",
					callbacks : [this.createTopic]
				}
			}
		};

	}
}
module.exports = Topics;
