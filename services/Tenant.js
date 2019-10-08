'use strict';
var debug = require('debug')("TenantService: ");
var Promise     = require('bluebird');
var _           = require('lodash');

var Model = appGlobals.dbModels;
var tenantModelName = 'tenants';


function TenantService() {
}


TenantService.prototype.getTenants = function(q) {
	var tDbModels = Model.getModelInstance(tenantModelName);
    return tDbModels.find(q);
};

TenantService.prototype.createTenant = function(payload) {
	var tDbModels = Model.getModelInstance(tenantModelName);
    return tDbModels.create(payload);
};

module.exports = {
    getInst : function() {
        return new TenantService();
    }
};