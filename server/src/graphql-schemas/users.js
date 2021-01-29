/*
Defines all the Scheme for User related GraphQL functions
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError, PermissionsError } = require('../func/errors');
const database = require('../database');
const { permLevel } = require('../func/permissions');
const bcrypt = require('bcrypt');
const mongo = require('mongodb');

const typeDefs = gql`
    "Represents details of a user"
    type User {
        id: ID
        firstName: String
        lastName: String
        level: Int
        permission: String
        email: String
    }

    extend type Query {
        "Get the details of the current logged in user"
        getLoginUser: User
        "Get a list of all users"
        getUsers: [User]
    }

    extend type Mutation {
        "Creates new user in db"
        setNewUser(
            firstName: String!
            lastName: String!
            email: String!
            password: String!
            level: Int!
        ): User

        "Updates user in db"
        updateUser(
            id: ID!
            firstName: String
            lastName: String
            email: String
            password: String
            level: Int
        ): User

        "Deletes user"
        deleteUser(id: ID!): User
    }
`;

const resolvers = {
    Query: {
        getLoginUser: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const UserCollection = database.getDb().collection('users');
                    var o_id = new mongo.ObjectID(ctx.user.ID);
                    const loginUser = await UserCollection.findOne({ _id: o_id });
                    return {
                        id: loginUser._id,
                        firstName: loginUser.firstName,
                        lastName: loginUser.lastName,
                        level: loginUser.level,
                        email: loginUser.email,
                        permission: permLevel[loginUser.level]
                    };
                } catch (err) {
                    throw new Error('Internal Error');
                }
            } else {
                throw new AuthenticationError('Authentication token is invalid, please log in');
            }
        },

        getUsers: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const UserCollection = database.getDb().collection('users');
                var o_id = new mongo.ObjectID(ctx.user.ID);
                try {
                    const users = await UserCollection.find().toArray();
                    var replyList = [];
                    for (let x in users) {
                        replyList.push({
                            id: users[x]._id,
                            firstName: users[x].firstName,
                            lastName: users[x].lastName,
                            level: users[x].level,
                            email: users[x].email,
                            permission: permLevel[users[x].level]
                        });
                    }
                    return replyList;
                } catch (err) {
                    throw new Error('Internal Error');
                }
            } else {
                throw new AuthenticationError('Authentication token is invalid, please log in');
            }
        }
    },

    Mutation: {
        setNewUser: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                if (ctx.user.Level >= 2) {
                    const UserCollection = database.getDb().collection('users');
                    const hashPass = await bcrypt.hash(arg.password, 12);
                    const r = await UserCollection.insertOne({
                        firstName: arg.firstName,
                        lastName: arg.lastName,
                        email: arg.email,
                        level: arg.level,
                        password: hashPass
                    });
                    const insertedData = r.ops[0];
                    return {
                        id: insertedData._id,
                        firstName: insertedData.firstName,
                        lastName: insertedData.lastName,
                        level: insertedData.level,
                        permission: permLevel[insertedData.level],
                        email: insertedData.email
                    };
                } else {
                    throw new ForbiddenError('Insufficient permission level');
                }
            } else {
                throw new AuthenticationError('Authentication token is invalid, please log in');
            }
        },

        updateUser: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                if (ctx.user.Level >= 2) {
                    const UserCollection = database.getDb().collection('users');
                    var o_id = new mongo.ObjectID(arg.id);
                    const loginUser = await UserCollection.findOne({ _id: o_id });
                    if (loginUser) {
                        var updateField = {};
                        if ('firstName' in arg) {
                            updateField.firstName = arg.firstName;
                        }
                        if ('lastName' in arg) {
                            updateField.lastName = arg.lastName;
                        }
                        if ('email' in arg) {
                            updateField.email = arg.email;
                        }
                        if ('level' in arg) {
                            updateField.level = arg.level;
                        }
                        if ('password' in arg) {
                            updateField.password = await bcrypt.hash(arg.password, 12);
                        }
                        const r = await UserCollection.updateOne(
                            { _id: o_id },
                            { $set: updateField }
                        );
                        const loginUser = await UserCollection.findOne({ _id: o_id });
                        return {
                            id: loginUser._id,
                            firstName: loginUser.firstName,
                            lastName: loginUser.lastName,
                            level: loginUser.level,
                            email: loginUser.email,
                            permission: permLevel[loginUser.level]
                        };
                    } else {
                        throw new IdError('user ID invalid');
                    }
                } else {
                    throw new ForbiddenError('Insufficient permission level');
                }
            } else {
                throw new AuthenticationError('Authentication token is invalid, please log in');
            }
        },

        deleteUser: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const UserCollection = database.getDb().collection('users');
                    var o_id = new mongo.ObjectID(arg.id);
                    const loginUser = await UserCollection.findOne({ _id: o_id });
                    if (loginUser) {
                        if (ctx.user.ID == arg.id) {
                            throw new Error('Cannot delete current user');
                        } else {
                            await UserCollection.deleteOne({ _id: o_id });

                            return {
                                id: loginUser._id,
                                firstName: loginUser.firstName,
                                lastName: loginUser.lastName,
                                level: loginUser.level,
                                email: loginUser.email,
                                permission: permLevel[loginUser.level]
                            };
                        }
                    } else {
                        throw new Error("User doesn't exists");
                    }
                } catch (err) {
                    throw new Error(`Internal error: ${err}`);
                }
            } else {
                throw new AuthenticationError('Authentication token is invalid, please log in');
            }
        }
    }
};

module.exports = {
    Users: typeDefs,
    UserResolvers: resolvers
};
