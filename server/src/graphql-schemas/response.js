/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError } = require('../func/errors');
const database = require('../database');
const { DBRef } = require('mongodb');
const mongo = require('mongodb');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

input rValuesInput{
    qID: ID!
    values: [String]!
}

input ResponseInput{
    questionnaireID: ID!
}

type rValues{
    qID: ID
    values: [String]
}

type Response{
    questionnaireID: ID
    responses: [rValues]
}
`;

const resolvers = {

};

module.exports = {
    Response: typeDefs,
    ResponseResolvers: resolvers
}




