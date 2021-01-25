/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql, ForbiddenError } = require('apollo-server-express');
const database = require('../database');
const { permLevel } = require('../func/permissions')
const bcrypt = require('bcrypt');
var mongo = require('mongodb');
const { has } = require('lodash');


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

    extend type Mutation{
        "Creates new user in db"
        setNewUser(
            firstName: String!,
            lastName: String!,
            email: String!,
            password: String!,
            level: Int
        ): User

        "Updates user in db"
        updateUser(
            id: ID!,
            firstName: String,
            lastName: String,
            email: String,
            password: String,
            level: Int
        ): User
    }
`;

const resolvers = {
    Query: {
        getLoginUser: async (parent, arg, ctx, info) => {
            const UserCollection = database.getDb().collection('users');
            if (ctx.auth) {
                console.log(ctx)
                var o_id = new mongo.ObjectID(ctx.user.ID);
                const loginUser = await UserCollection.findOne({ "_id": o_id })
                return {
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

    Mutation: {

        setNewUser: async (parent, arg, ctx, info) => {

            if (ctx.auth) {
                if (ctx.user.Level >= 2) {
                    const UserCollection = database.getDb().collection('users');
                    const hashPass = await bcrypt.hash(arg.password, 12);
                    await UserCollection.insertOne({ firstName: arg.firstName, lastName: arg.lastName, email: arg.email, level: arg.level, password: hashPass })
                    return {
                        firstName: arg.firstName,
                        lastName: arg.lastName,
                        level: arg.level,
                        permission: permLevel[arg.level],
                        email: arg.email
                    }
                }
                else {
                    throw new ForbiddenError(
                        'Insufficient permission level'
                    )
                }
            }
            else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        updateUser: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                if (ctx.user.Level >= 2) {
                    const UserCollection = database.getDb().collection('users');
                    var o_id = new mongo.ObjectID(ctx.user.ID);
                    const loginUser = await UserCollection.findOne({ "_id": o_id })
                    if (loginUser) {
                        var updateField = {}
                        if ('firstName' in arg) {
                            updateField.firstName = arg.firstName
                        }
                        if ('lastName' in arg) {
                            updateField.lastName = arg.lastName
                        }
                        if ('email' in arg) {
                            updateField.email = arg.email
                        }
                        if ('level' in arg) {
                            updateField.level = arg.level
                        }
                        if ('password' in arg) {
                            updateField.password = await bcrypt.hash(arg.password, 12);
                        }
                        await UserCollection.updateOne({ "_id": o_id }, {$set:updateField})

                        const loginUser = await UserCollection.findOne({ "_id": o_id })
                        return {
                            firstName: loginUser.firstName,
                            lastName: loginUser.lastName,
                            level: loginUser.permission,
                            email: loginUser.email,
                            permission: permLevel[loginUser.permission]
                        }
                    }
                }
                else {
                    throw new ForbiddenError(
                        'Insufficient permission level'
                    )
                }
            }
            else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        }
    }
};

module.exports = {
    Users: typeDefs,
    UserResolvers: resolvers
}