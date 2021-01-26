/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql } = require('apollo-server-express');
const { IdError } = require('../func/errors');
const database = require('../database');
const { DBRef } = require('mongodb');
const mongo = require('mongodb');
const staffHelper = require('../func/staff')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    input StudyPermissionsInput{
        edit: Int!
        create: Int!
        delete: Int!
    }

    input StudyInput{
        title: String!
        description: String!
        permissions: StudyPermissionsInput!
        staff: [ID]
    }

    type StudyPermissions{
        edit: Int
        create: Int
        delete: Int
    }

    type Study{
        id: ID
        title: String
        description: String
        staff: [User]
        permissions: StudyPermissions
    }

    extend type Query {
        getStudy(id: ID): Study
    }

    extend type Mutation {
        "Create a new Study"
        createNewStudy(
            study: StudyInput
        ):Study
    }
`;

// Resolvers define the technique for fetching the types defined in the Schema above
const resolvers = {
    // Query: {
    // },

    Mutation: {
        createNewStudy: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                if (ctx.user.Level >= 1) {
                    try{
                        const StudyCollection = database.getDb().collection('study');
                    const newStudy = {
                        title: arg.study.title,
                        description: arg.study.description,
                        permissions: {
                            edit: arg.study.permissions.edit,
                            create: arg.study.permissions.create,
                            delete: arg.study.permissions.delete
                        },
                        staff: [
                            {
                                $ref: "users",
                                $id: new mongo.ObjectID(ctx.user.ID)
                            }
                        ]
                    }
                    if ('staff' in arg.study) {
                        const UserCollection = database.getDb().collection('users');
                        for (let x in arg.study.staff) {
                            const o_id = new mongo.ObjectID(arg.study.staff[x]);
                            const loginUser = await UserCollection.findOne({ "_id": o_id })
                            if (loginUser) {
                                newStudy.staff.push({
                                    $ref: "users",
                                    $id: o_id
                                })
                            }
                        }
                    }
                    const response = await StudyCollection.insertOne(newStudy)
                    reply = {
                        id: response.ops[0]._id,
                        title: response.ops[0].title,
                        description: response.ops[0].description,
                        permissions: response.ops[0].permissions,
                        staff: []
                    }
                    for(let x in response.ops[0].staff){
                        reply.staff.push(await staffHelper.getStaffDetails(response.ops[0].staff[x].$id))
                    }
                    return reply
                    }catch(err){
                        throw new Error(
                            `Internal Error ${err}`
                        )
                    }
                } else {
                    throw new ForbiddenError(
                        'Insufficient permission level'
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        }
    }
};

module.exports = {
    Study: typeDefs,
    StudyResolvers: resolvers
};
