const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'https://ucffavwcmb:qxhtiild6r@wxzvrdsearch-2544427145.eu-central-1.bonsaisearch.net:443',
});

module.exports = client