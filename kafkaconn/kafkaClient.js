var Promise = require("bluebird");
const uuidv4 = require('uuid').v4;
var kafka = require('kafka-node');
var debug = require("debug")("kafka-client")
var HighLevelProducer = kafka.HighLevelProducer;
var ConsumerGroup = kafka.ConsumerGroup;
var gproducer;
let client;

topicMap ={};


module.exports.connect = function() {
    if(client) return client;
    client = new kafka.KafkaClient({kafkaHost: config.get("kafka.kafkaHosts") });
    return client;
}

module.exports.createTopics = function(topicInfo) {
    let client = this.connect();

    var topicsToCreate = [{
        topic: topicInfo.tenantName+""+topicInfo.name,
        partitions: topicInfo.partitions||10,
        replicationFactor: topicInfo.replicationFactor||1
      }];

    return new Promise((resolve, reject)=>{
        client.createTopics(topicsToCreate, (error, result) => {
            if(error) return reject(error);
            topicMap[topicInfo.name] = 1;
            return resolve();
        });
    });
}

module.exports.getProducer = function () {
    if(gproducer) return gproducer;

    let client = this.connect();
    var producer = new HighLevelProducer(client);
    gproducer = producer;

    producer.on('ready', function () {
        console.log("Producer for countries is ready");
    });

    producer.on('error', function (err) {
        console.error("Problem with producing Kafka message " + err);
    });
    return producer;
}


module.exports.createConsumerGroup = function (topic, pushToES) {
    let client = this.connect();
    const options = {
        kafkaHost: config.get("kafka.kafkaHosts"),
        groupId: config.get("kafka.consumergrpname"),
        autoCommit: false,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        fromOffset: "earliest"
    };
    var consumerGroup = new ConsumerGroup(options, topic);

    consumerGroup.on('error', (error)=>{
        console.error(error);
        console.error(error.stack);
    });
    consumerGroup.on('message', (message)=> {
        debug(
            '%s read msg Topic="%s" Partition=%s Offset=%d',
            client.clientId,
            message.topic,
            message.partition,
            message.offset
        );
        var payload = JSON.parse(message.value);
        return pushToES({index: message.topic, id: payload.id|| uuidv4(), body:payload.data}).then(()=>{
            return consumerGroup.commit(true,()=>{});
        }).catch((err)=>{
            console.log("ccccc", err)
        })
    });
    return consumerGroup;
}

module.exports.produceMessage = function(message, topicInfo ) {
    let self = this;
    let topicsP = Promise.resolve();
    if(!topicMap[message.topic])
        topicsP = this.createTopics(topicInfo);
    
    return topicsP.then(()=>{
        let payloads = [
            { topic: message.topic, messages: JSON.stringify(message) },
        ];
        let producer = self.getProducer();
        return producer.send(payloads, function (err, data) {
            if(err) {
                console.log(err);
            }
            return Promise.resolve();
        });
    })
    
}
