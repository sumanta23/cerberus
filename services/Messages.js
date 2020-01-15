'use strict';
var debug = require('debug')("MessageService: ");
var Promise = require('bluebird');
var _ = require('lodash');
var BaseService = require("@sumanta23/server-wrapper").BaseService;
var errors = require("perror-wrapper");
var kafkaClient = require("../kafkaconn/kafkaClient.js");

var Model = appGlobals.dbModels;
var topicsModelName = 'topics';


class MessageService extends BaseService {
    constructor(context) {
        super(context)
        this.context = context;
    }


    consumeMessage(topicId, payload) {
        var tDbModels = Model.getModelInstance(topicsModelName);
        return tDbModels.find({ _id: topicId }).then((topic) => {
            if (_.size(topic) == 1) {
                payload.topic = topic[0].tenantName + "" + topic[0].name;
                debug(">>>>>", topic[0], payload);
                return kafkaClient.produceMessage(payload, topic[0]);
            }
            else {
                return new Promise.reject(new errors.BadRequest("topic not found"));
            }
        });
    };
}

module.exports = MessageService;