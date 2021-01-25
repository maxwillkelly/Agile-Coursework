const { ApolloServer } = require('apollo-server-express');
const schema = require('../schema');

function constructTestServer(context) {
    const server = new ApolloServer({
        schema: schema,
        context: context
    });

    return server;
}

module.exports.constructTestServer = constructTestServer;
