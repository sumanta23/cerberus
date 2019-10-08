var BaseModel = require('mongodbconnection-wrapper').getBaseModel();

class TenantModel extends BaseModel {

    constructor(dbMgr, options){
        super(dbMgr, options);
        this.idName = "tenants"
        this.modelName = 'tenants';
    }

}

module.exports = TenantModel;