const ConfigWrapper = new (require("config-wrapper"))();
const config = ConfigWrapper.config;

const initTracer = require('jaeger-client').initTracer;
let tracer=initTracer(config.get("tracer").config, {});

var redisconnection = require("redisconnection-wrapper")(config.get("redis"));
var sub = require("redisconnection-wrapper")(config.get("redis"));

var boot = new (require("boot-wrapper"))();

const LoggerWrapper = require("applogger-wrapper").LoggerWrapper;
var logger = new LoggerWrapper(config.get("logger"));

var dbMgr = require('mongodbconnection-wrapper');
var dbname = process.env.NODE_ENV === 'test' ? "test" : undefined;
var modelPath= "./db/models";
var schemaPath= "./db/schemas";

sub.subscribe("newtopic", function(err,count) {
	console.log("count -> ", count);
});
sub.on('message', function(channel, message){
	debug("message from redis %s -> %s",channel, message );
	attachToCG(message);
});

var kafka = require('kafka-node');
var async = require('async');
var _           = require('lodash');
var ConsumerGroup = kafka.ConsumerGroup;
var debug = require("debug")("kafka-consumer");

let consumerGroups=[];


boot.init(config)
	.then(async ()=>{
		await boot.defineInGlobal("tracer", tracer);
		await boot.bootlogger(logger, "glogger");

		await boot.bootredis(redisconnection);
		await dbMgr.initialize(config.get("db"), { dbname, modelPath, schemaPath })
			.then((mInst)=>boot.bootdb(mInst, dbMgr.getModel()));
	}).then(async ()=>{
		var TopicService = require("./services/Topic.js");
		var kafkaClient = require("./kafkaconn/kafkaClient.js");
		var {pushToES} = require("./es/index.js");
		let TopicServiceInst = new TopicService();
		TopicServiceInst.getAllTopics().then((allTopics)=>{
			_.map(allTopics,(topic)=>{
				topicname = topic.tenantName+""+topic.name;
				console.log("attaching consumer for topic", topicname)
				let cg = kafkaClient.createConsumerGroup(topicname, pushToES);
				consumerGroups.push(cg);
			});
		});
	});

function attachToCG(topicName){
	var kafkaClient = require("./kafkaconn/kafkaClient.js");
	var {pushToES} = require("./es/index.js");
	console.log("attaching consumer for topic", topicname)
	let cg = kafkaClient.createConsumerGroup(topicName, pushToES);
	consumerGroups.push(cg);
}

process.once('SIGINT', function () {
	async.each(consumerGroups, function (consumer, callback) {
		return consumer.close(true, callback);
	});
});

