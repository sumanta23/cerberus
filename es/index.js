const { Client } = require('@elastic/elasticsearch');
const esconfig = config.get("es");

const url = process.env.ELASTIC_URL || `${esconfig.PREFIX}${esconfig.HOST}:${esconfig.PORT}`

const client =  new Client({
  node: url,
  maxRetries: esconfig.RETRY,
  requestTimeout: esconfig.REQUEST_TIMEOUT,
});


const pushToES = (data) => {
  return client.index({
    index: data.index,
    id: data.id,
    body: data.body
  });
}

module.exports = { client , pushToES};
