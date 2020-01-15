'use strict';
var debug         = require('debug')("TopicService: ");
var Promise       = require('bluebird');
var errors        = require("perror-wrapper");
var _             = require('lodash');
var BaseService   = require("common-wrapper").BaseService;
var TenantService = require("../services/Tenant.js");

var Model = appGlobals.dbModels;
var topicModelName = 'topics';


class TopicService  extends BaseService {
	constructor(context) {
		super(context);
	}


	getAllTopics (tenantId) {
		let tDbModels = Model.getModelInstance(topicModelName);
		let q = {};
		if (tenantId) q.tenantId = tenantId;
		return tDbModels.find(q);
	}

	createTopic (payload) {
		let TenantServiceInst = new TenantService(this.context);
		return TenantServiceInst.getTenants({ _id: payload.tenantId }).then((tenants) => {
			if (_.size(tenants) == 1) {
				payload.tenantName = tenants[0].name;
				let tDbModels = Model.getModelInstance(topicModelName);
				return tDbModels.create(payload).tap(() => {
					return redis.publish("newtopic", payload.tenantName + payload.name);
				});
			} else {
				return new Promise.reject(new errors.BadRequest("tenant not found"));
			}
		});
	}
}
module.exports = TopicService;
