/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql } = require('apollo-server-express');
const database = require('../database');
const { permLevel } = require('../func/permissions')
var mongo = require('mongodb');


const typeDefs = gql`
    type User {
        firstName: String,
        lastName: String,
        level: Int,
        permission: String,
        email: String
    }

    extend type Query {
        getLoginUser: User
    }
`;

const resolvers = {
    Query: {
        getLoginUser: async (parent, arg, ctx, info) => {
            const UserCollection = database.getDb().collection('users');
            if (ctx.auth) {
                console.log(ctx)
                var o_id = new mongo.ObjectID(ctx.user.ID);
                const loginUser = await UserCollection.findOne({"_id": o_id})
                return{
                    firstName: loginUser.firstName,
                    lastName: loginUser.lastName,
                    level: loginUser.permission,
                    email: loginUser.email,
                    permission: permLevel[loginUser.permission]
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        }
    },
};

module.exports = {
    Users: typeDefs,
    UserResolvers: resolvers
}