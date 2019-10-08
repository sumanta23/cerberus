'use strict';


function loadSchema(Schema,db){

    var tenants = {
        "_id":{
            type:String,
            trim:true
        },
        "name" : {
            type:String,
            trim:true,
            required: true,
            validate: /^[a-z]{1,10}$/
        },
        "description" : {
            type:String,
            trim:true,
            maxlength: 50
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

    db.model('tenants', new Schema(tenants), 'tenants');
}
module.exports = loadSchema;
