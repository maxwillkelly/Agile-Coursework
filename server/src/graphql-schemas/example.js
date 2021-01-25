/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql } = require('apollo-server-express');
const { IdError } = require('../func/errors');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  "Represents A product's details"
  type Product{
      ProductID: ID
      Name: String
  }

  extend type Query{
    "Get first 5 prime numbers back"
    getPrimes: [Int]
  }

  extend type Mutation{
    "Add Material to a Product"
    addNumbers(
      values: [Int!]
    ): Int
  }
`;

// Resolvers define the technique for fetching the types defined in the Schema above
const resolvers = {
  Query: {
    getPrimes: async (parent, arg, ctx, info) => {
      return [2, 3, 5, 7, 11]
    }
  },

  Mutation: {
    addNumbers: async (parent, arg, ctx, info) => {
        var total = 0;
        for (let x in arg.values){
          total = total + arg.values[x];
        }
        return total;
    }
  }
};

module.exports = {
  Examples: typeDefs,
  ExampleResolvers: resolvers,
}
