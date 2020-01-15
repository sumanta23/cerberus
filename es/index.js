const { Client } = require('@elastic/elasticsearch');
const esconfig = config.get("es");

const url = process.env.ELASTIC_URL || `${esconfig.PREFIX}${esconfig.HOST}:${esconfig.PORT}`;

const client =  new Client({
	node: url,
	maxRetries: esconfig.RETRY,
	requestTimeout: esconfig.REQUEST_TIMEOUT,
	auth: {
		username: 'elastic',
		password: 'supersecret'
	}
});


const pushToES = (data) => {
	data.body.timestamp = (new Date()).toISOString();
	var today = new Date();
	today=today.toISOString().substring(0, 10);
	return client.index({
		index: data.index+"-"+today,
		id: data.id,
		body: data.body
	});
};

module.exports = { client , pushToES};
