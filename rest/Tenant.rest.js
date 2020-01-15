var paramType          = require("@sumanta23/server-wrapper").paramTypes;
var serviceHandler     = require("@sumanta23/server-wrapper").serviceHandler;

var Promise            = require('bluebird');
var _                  = require('lodash');

var TenantService      = require("../services/Tenant.js");

class Tenants {
	constructor(url_prefix="/api"){
		this.url_prefix = url_prefix;
	}

	getTenants(req, res) {
		let TenantServiceInst = new TenantService(req.context);
		serviceHandler(req, res, TenantServiceInst.getTenants({}));
	}

	createTenant(req, res) {
		let TenantServiceInst = new TenantService(req.context);
		serviceHandler(req, res, TenantServiceInst.createTenant(req.body));
	}

	getMappings () {
		return {
			'/tenant' : {
				get : {
					tags: ["Tenant"],
					summary: "Get all Tenants",
					callbacks : [this.getTenants]
				},
				post :{
					tags: ["Tenant"],
					summary: "create Tenants",
					callbacks : [this.createTenant]
				}
			}
		};

	}
}

module.exports = Tenants;
