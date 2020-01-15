let paramType          = require("@sumanta23/server-wrapper").paramTypes;
let serviceHandler     = require("@sumanta23/server-wrapper").serviceHandler;
let BaseRest           = require("@sumanta23/server-wrapper").BaseRest;
let errors             = require("perror-wrapper");

let Promise            = require('bluebird');
let _                  = require('lodash');

let MessageService     = require("../services/Messages.js")

class Messages extends BaseRest {

	constructor(url_prefix="/api"){
		super()
		this.url_prefix = url_prefix;
	}

	createMessage(req, res) {
		let context = req.context;
		this.logger.info("kkk");
		let MessageServiceInst = new MessageService(context);
		if(!req.params.topicId)
			return serviceHandler(req, res, new Promise.reject(new errors.BadRequest("topicId not found")));
		serviceHandler(req, res, MessageServiceInst.consumeMessage(req.params.topicId, req.body));
	};

	getMappings() {
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

}

module.exports = Messages
