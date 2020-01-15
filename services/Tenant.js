'use strict';
var debug       = require('debug')("TenantService: ");
var Promise     = require('bluebird');
var _           = require('lodash');
var BaseService = require("common-wrapper").BaseService;

var Model = appGlobals.dbModels;
var tenantModelName = 'tenants';

class TenantService extends BaseService {

	constructor(context) {
		super(context);
	}


	getTenants(q) {
		this.logger.info("query>>",q);
		var tDbModels = Model.getModelInstance(tenantModelName, this.context);
		return tDbModels.find(q);
	}

	createTenant(payload) {
		var tDbModels = Model.getModelInstance(tenantModelName, this.context);
		return tDbModels.create(payload);
	}
}

module.exports = TenantService;
