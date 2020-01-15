var paramType          = require("common-wrapper").paramTypes;
var serviceHandler     = require("common-wrapper").serviceHandler;

var Promise            = require('bluebird');
var _                  = require('lodash');
let BaseRest           = require("common-wrapper").BaseRest;
var TenantService      = require("../services/Tenant.js");

class Tenants extends BaseRest {
	constructor(url_prefix="/api"){
		super();
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
