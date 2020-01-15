var paramType          = require("common-wrapper").paramTypes;
var serviceHandler     = require("common-wrapper").serviceHandler;
var errors             = require("perror-wrapper");

var Promise            = require('bluebird');
var _                  = require('lodash');
let BaseRest           = require("common-wrapper").BaseRest;
var TopicService       = require("../services/Topic.js");

class Topics extends BaseRest {

	constructor(url_prefix="/api"){
		super();
		this.url_prefix = url_prefix;
	}

	getTopics (req, res) {
		let TopicServiceInst = new TopicService(req.context);
		if(!req.params.tenantId)
			return serviceHandler(req, res, new Promise.reject(new errors.BadRequest("tenantId missing")));
		serviceHandler(req, res, TopicServiceInst.getAllTopics(req.params.tenantId));
	}

	createTopic (req, res) {
		let TopicServiceInst = new TopicService(req.context);
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
