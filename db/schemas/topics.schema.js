'use strict';


function loadSchema(Schema,db){

	var topics = {
		"_id":{
			type:String,
			trim:true
		},
		"tenantId" :{
			type:String,
			trim:true,
			required: true
		},
		"tenantName":{
			type:String,
			trim:true,
			required: true
		},
		"name" : {
			type:String,
			trim:true,
			required: true,
			validate: /^[a-z]{1,10}$/
		},
		"option": {
			"type": Schema.Types.Mixed,
			"required": true
		},
		"cOn" : {
			type : Date,
			default: Date.now
		},
		"mOn" : {
			type : Date,
			default: Date.now
		}
	};

	db.model('topics', new Schema(topics), 'topics');
}
module.exports = loadSchema;
