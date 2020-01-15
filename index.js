const ConfigWrapper = new (require("config-wrapper"))();
const config = ConfigWrapper.config;

const initTracer = require('jaeger-client').initTracer;
let tracer=initTracer(config.get("tracer").config, {});

var redisconnection = require("redisconnection-wrapper")(config.get("redis"));

const LoggerWrapper = require("applogger-wrapper").LoggerWrapper;
var logger = new LoggerWrapper(config.get("logger"));

var dbMgr = require('mongodbconnection-wrapper');
var dbname = process.env.NODE_ENV === 'test' ? "test" : undefined;
var modelPath= "./db/models";
var schemaPath= "./db/schemas";

var boot = new (require("boot-wrapper"))();

var APIServer = require("@sumanta23/server-wrapper").APIServer;

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
		await boot.defineInGlobal("tracer", tracer);
		await boot.bootlogger(logger, "glogger");
		await boot.bootredis(redisconnection);
		await dbMgr.initialize(config.get("db"), { dbname, modelPath, schemaPath })
			.then((mInst)=>boot.bootdb(mInst, dbMgr.getModel()));
	}).then(async ()=>{
		var api = new APIServer(app, 5000, { restPath, schemaPath: validationSchema, validationRequired, apidocRequired, basicSecRequired, xssIgnoreList, baseURL, apiPrefix:"", PEPRequired:true, pepFunction:pepFunction, tracing:true, instrumenatation: tracer })
		api.init()
		api.loadapi();
		api.start();
	})
