var BaseModel = require('mongodbconnection-wrapper').getBaseModel();

class TopicModel extends BaseModel {

	constructor(dbMgr, options){
		super(dbMgr, options);
		this.idName = "topics";
		this.modelName = 'topics';
	}

}

module.exports = TopicModel;