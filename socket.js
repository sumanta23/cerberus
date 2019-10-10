var _         = require("lodash");
var debug     = require("debug")("wsserver");
var boot = require("boot-wrapper");
var config = require("config-wrapper");
var redisconnection = require("redisconnection-wrapper")(config.get("redis"));
var subchannel = require("redisconnection-wrapper")(config.get("redis"));

var dbMgr = require('mongodbconnection-wrapper');
var dbname = process.env.NODE_ENV === 'test' ? "test" : undefined;
var modelPath= "./db/models";
var schemaPath= "./db/schemas";

var wsconfig = config.get("ws");

var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app);

var port = process.env.PORT || wsconfig.port;

boot.init(config)
  .then(async () => {
    await boot.bootredis(redisconnection);
    var senderM = require("@sumanta23/server-wrapper").sender;
    await boot.bootsender(senderM);
    await dbMgr.initialize(config.get("db"), { dbname, modelPath, schemaPath })
        .then((mInst)=>boot.bootdb(mInst, dbMgr.getModel()));
  }).then(async () => {
    var ws = require("@sumanta23/server-wrapper").wsserver;
    var messages = require("./services/Messages.js").getInst();
    ws.listen(server, Object.assign(wsconfig,{broadcastisonline:false}), (e)=>{return e}, redisconnection, subchannel, (userId, event, data)=>{
        if(event==="data"){
          messages.consumeMessage(data.topicId, {data:data.data});
        }
    });
    server.listen(port, function () {
      debug("server started on localhost:" + port);
    });
  })
