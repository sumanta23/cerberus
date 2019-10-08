var paramType          = require("@sumanta23/server-wrapper").paramTypes;
var serviceHandler     = require("@sumanta23/server-wrapper").serviceHandler;

var Promise            = require('bluebird');
var _                  = require('lodash');

var TenantService      = require("../services/Tenant.js");

module.exports.getTenants = function(req, res) {
    let TenantServiceInst = TenantService.getInst();
	serviceHandler(req, res, TenantServiceInst.getTenants({}));
};

module.exports.createTenant = function(req, res) {
    let TenantServiceInst = TenantService.getInst();
	serviceHandler(req, res, TenantServiceInst.createTenant(req.body));
};

module.exports.url_prefix = "/api" ;
module.exports.getMappings = function() {
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
    }

};