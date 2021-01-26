/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql } = require('apollo-server-express');
const { IdError } = require('../func/errors');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    input Questionnaire{
        title: String
        studyID: String
    }

    extend type Query {
    }

    extend type Mutation {

    }
`;

// Resolvers define the technique for fetching the types defined in the Schema above
const resolvers = {
    Query: {
    },

    Mutation: {
    }
};

module.exports = {
    Questionnaire: typeDefs,
    QuestionnaireResolvers: resolvers
};
