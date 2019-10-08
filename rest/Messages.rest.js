let paramType          = require("@sumanta23/server-wrapper").paramTypes;
let serviceHandler     = require("@sumanta23/server-wrapper").serviceHandler;
let errors             = require("perror-wrapper");

let Promise            = require('bluebird');
let _                  = require('lodash');

let MessageService     = require("../services/Messages.js")

module.exports.createMessage = function(req, res) {
    let MessageServiceInst = MessageService.getInst();
    if(!req.params.topicId)
        return serviceHandler(req, res, new Promise.reject(new errors.BadRequest("topicId not found")));
	serviceHandler(req, res, MessageServiceInst.consumeMessage(req.params.topicId, req.body));
};

module.exports.url_prefix = "/api" ;
module.exports.getMappings = function() {
    return {
        '/:topicId/messages' : {
            post :{
                tags: ["Message"],
                summary: "create Messages",
                callbacks : [this.createMessage],
                parameters: [
                    paramType.body("body", "message payload", "messages", true)
                ]
            }
        }
    }

};
