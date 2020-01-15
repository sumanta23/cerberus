# API server

    var config = require("config-wrapper");
    var redisconnection = require("redisconnection-wrapper")(config.get("redis"));

    var mq = require("rabbitmqconnection-wrapper");
    mq.start(config.get("rabbitmq"));

    var logger = require("applogger-wrapper");
    logger.init(config.get("logger"));

    var dbMgr = require('mongodbconnection-wrapper');
    var dbname = process.env.NODE_ENV === 'test' ? "test" : undefined;
    var modelPath= "./db/models";
    var schemaPath= "./db/schemas";

    var boot = require("boot-wrapper");
    var api = require("@sumanta/server-wrapper").api;
    var cors = require("cors");
    var express = require("express");
    var app = express();
    app.use(cors("*"));

    restPath = __dirname+"/rest";
    schemaPath= __dirname+"/schema";
    validationRequired= apidocRequired= basicSecRequired = true;
    xssIgnoreList=[]
    baseURL = "localhost:5000"


    boot.init(config)
    .then(async ()=>{
        await boot.bootlogger(logger);
        await boot.bootredis(redisconnection)
        await dbMgr.initialize(config.get("db"), { dbname, modelPath, schemaPath })
            .then((mInst)=>boot.bootdb(mInst, dbMgr.getModel()));
        await boot.bootrabbitmq(mq.getConn);
    }).then(async ()=>{
        // var Model = appGlobals.dbModels;
        // var vModelName = 'votings';
        // var vDbModels = Model.getModelInstance(vModelName);
        // mq.sendToQueue("test",{"helo":"data"});
        // mq.registerConsumer("test",(data)=>{logger.info(data); return Promise.resolve();});  
        // await vDbModels.create({callId:"55", option:"kl", userId:"ioio"}).tap(()=>vDbModels.findOne({}).tap(console.log))
        api.init(app, 5000, { restPath, schemaPath, validationRequired, apidocRequired, basicSecRequired, xssIgnoreList, baseURL })
        api.loadapi(app);
        api.start(app);
    })

# Socket server
    var _         = require("lodash");
    var debug     = require("debug")("wsserver");
    var boot = require("boot-wrapper");
    var config = require("config-wrapper");
    var redisconnection = require("redisconnection-wrapper")(config.get("redis"));
    var subchannel = require("redisconnection-wrapper")(config.get("redis"));

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
        //await boot.enableHealthMonitoring("ws");
    }).then(async () => {
        var ws = require("@sumanta23/server-wrapper").wsserver;
        ws.listen(server, wsconfig, ()=>{}, redisconnection, subchannel, ()=>{});
        server.listen(port, function () {
        debug("server started on localhost:" + port);
        });
    })
