'use strict';
var debug = require('debug')("TopicService: ");
var Promise     = require('bluebird');
var _           = require('lodash');

var Model = appGlobals.dbModels;
var topicModelName = 'topics';

var TenantService      = require("../services/Tenant.js");

function TopicService() {
}


TopicService.prototype.getAllTopics = function(tenantId) {
    let tDbModels = Model.getModelInstance(topicModelName);
    let q={};
    if(tenantId) q.tenantId = tenantId;
    return tDbModels.find(q);
};

TopicService.prototype.createTopic = function(payload) {
    let TenantServiceInst = TenantService.getInst();
    return TenantServiceInst.getTenants({_id:payload.tenantId}).then((tenants)=>{
        if(_.size(tenants)==1){
            payload.tenantName = tenants[0].name;
            let tDbModels = Model.getModelInstance(topicModelName);
            return tDbModels.create(payload).tap(()=>{
                return redis.publish("newtopic", payload.tenantName+payload.name);
            })
        }else{
            return Promise.reject("tentant not found");
        }
    });
};

module.exports = {
    getInst : function() {
        return new TopicService();
    }
};