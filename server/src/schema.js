/*
https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2/
Schema Builder
*/
const { makeExecutableSchema, gql } = require('apollo-server-express');
const { merge } = require('lodash');

// Seperate Schema Files
const { Examples, ExampleResolvers } = require('./graphql-schemas/example');
const { Users, UserResolvers } = require('./graphql-schemas/users')
const { Study, StudyResolvers } = require('./graphql-schemas/study')
// These empty Query an Mutations give a base to build off of for extending
const Query = gql`
    type Query {
        _empty: String
    }
`;

const Mutation = gql`
    type Mutation {
        _empty: String
    }
`;

const resolvers = {};

// Build Scheme with each file
const schema = makeExecutableSchema({
    typeDefs: [Query, Mutation, Examples, Users, Study],
    resolvers: merge(resolvers, ExampleResolvers, UserResolvers, StudyResolvers)
});

// Export as module
module.exports = schema;
