var config = require("config-wrapper");
var redisconnection = require("redisconnection-wrapper")(config.get("redis"));

var logger = require("applogger-wrapper");
logger.init(config.get("logger"));

var dbMgr = require('mongodbconnection-wrapper');
var dbname = process.env.NODE_ENV === 'test' ? "test" : undefined;
var modelPath= "./db/models";
var schemaPath= "./db/schemas";

var boot = require("boot-wrapper");
var api = require("@sumanta23/server-wrapper").api;
var cors = require("cors");
var express = require("express");
var app = express();
app.use(cors("*"));

restPath = __dirname+"/rest";
validationSchema = __dirname+"/schema";
validationRequired= apidocRequired= basicSecRequired = true;
xssIgnoreList=[]
baseURL = "localhost:5000"

var pepFunction = ()=>{
    console.log(arguments);
    return Promise.resolve(true);
}

boot.init(config)
.then(async ()=>{
    await boot.bootlogger(logger);
    await boot.bootredis(redisconnection);
    await dbMgr.initialize(config.get("db"), { dbname, modelPath, schemaPath })
        .then((mInst)=>boot.bootdb(mInst, dbMgr.getModel()));
}).then(async ()=>{
    api.init(app, 5000, { restPath, schemaPath: validationSchema, validationRequired, apidocRequired, basicSecRequired, xssIgnoreList, baseURL, apiPrefix:"", PEPRequired:true, pepFunction:pepFunction })
    api.loadapi(app);
    api.start(app);
})