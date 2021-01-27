/*
Defines all the Scheme for Study related GraphQL functions
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
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
        "Name of the study"
        title: String!
        "Short description of study"
        description: String!
        "Permissions levels used for the study"
        permissions: StudyPermissionsInput!
        "List of ID of user you want to assign to this study"
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
        "Get details on a study"
        getStudy(
            "ID of study to return"
            id: ID!
            ): Study
        "Get all studies"
        getStudies: [Study]
        "Get the studies that an user is assigned to"
        getStaffStudies(
            "The ID of the user"
            staffID: ID!
            ): [Study]
    }

    extend type Mutation {
        "Create a new Study"
        createNewStudy(
            study: StudyInput
        ):Study
        deleteStudy(studyID: ID!): Study
    }
`;

// Resolvers define the technique for fetching the types defined in the Schema above
const resolvers = {
    Query: {
        getStudy: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const StudyCollection = database.getDb().collection('study');
                    var o_id = new mongo.ObjectID(ctx.user.ID);
                    var s_id = new mongo.ObjectID(arg.id);

                    const currStudy = await StudyCollection.findOne({ "_id": s_id })
                    if (currStudy) {
                        staffReply = []
                        for (let y in currStudy.staff) {
                            try {
                                staffReply.push(
                                    await staffHelper.getStaffDetails(currStudy.staff[y].oid)
                                )
                            } catch
                            {

                            }
                        }
                        return {
                            id: currStudy._id,
                            title: currStudy.title,
                            description: currStudy.description,
                            permissions: currStudy.permissions,
                            staff: staffReply
                        }
                    }
                    else {
                        throw new Error(
                            "Internal Error"
                        )
                    }
                }
                catch (err) {
                    throw new Error(
                        `error ${err}`
                    )
                }
            }
        },

        getStudies: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const StudyCollection = database.getDb().collection('study');
                try {
                    const studies = await StudyCollection.find().toArray()
                    var replyList = []
                    for (let x in studies) {
                        staffReply = []
                        for (let y in studies[x].staff) {
                            try {
                                staffReply.push(
                                    await staffHelper.getStaffDetails(studies[x].staff[y].oid)
                                )
                            }
                            catch {

                            }
                        }
                        replyList.push(
                            {
                                id: studies[x]._id,
                                title: studies[x].title,
                                description: studies[x].description,
                                permissions: studies[x].permissions,
                                staff: staffReply
                            }
                        )
                    }
                    return replyList;
                }
                catch (err) {
                    throw new Error(
                        "Internal Error"
                    )
                }
            }
            else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        getStaffStudies: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const StudyCollection = database.getDb().collection('study');
                try {
                    var o_id = new mongo.ObjectID(arg.staffID);
                    const studies = await StudyCollection.find({ staff: DBRef("users", o_id) }).toArray()
                    var replyList = []
                    for (let x in studies) {
                        staffReply = []
                        for (let y in studies[x].staff) {
                            try {
                                staffReply.push(
                                    await staffHelper.getStaffDetails(studies[x].staff[y].oid)
                                )
                            }
                            catch {

                            }
                        }
                        replyList.push(
                            {
                                id: studies[x]._id,
                                title: studies[x].title,
                                description: studies[x].description,
                                permissions: studies[x].permissions,
                                staff: staffReply
                            }
                        )
                    }
                    return replyList;
                }
                catch (err) {
                    throw new Error(
                        "Internal Error"
                    )
                }
            }
            else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        }
    },

    Mutation: {
        createNewStudy: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                if (ctx.user.Level >= 1) {
                    try {
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
                        for (let x in response.ops[0].staff) {
                            reply.staff.push(await staffHelper.getStaffDetails(response.ops[0].staff[x].$id))
                        }
                        return reply
                    } catch (err) {
                        throw new Error(
                            `Internal Error ${err}`
                        )
                    }
                } else {
                    throw new AuthenticationError(
                        'Insufficient permission level'
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        //ToDo work with study perms rather than global
        deleteStudy: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                if (ctx.user.level >= 2) {
                    try {
                        const StudyCollection = database.getDb().collection('study');
                        var s_id = new mong.ObjectID(arg.id);
                        const currStudy = await StudyCollection.findOne({ "_id": s_id });
                        if (currStudy) {
                            const QuestionnaireCollection = database.getDb().collection('questionaires');
                            const questionnaires = await QuestionnaireCollection.find({ studyID: DBRef("questionaires", s_id) }).toArray()

                            if (questionnaires) {
                                for (let x in questionnaires) {
                                    var q_id = questionnaires[x]._id
                                    await QuestionnaireCollection.deleteOne({ "_id": q_id })
                                }
                            }
                            await StudyCollection.deleteOne({ "_id": s_id })
                        }
                        else {
                            throw new Error(
                                "Study doesn't exist"
                            )
                        }
                    }
                    catch (err) {
                        throw new Error(
                            `Internal error: ${err}`
                        )
                    }
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
    Study: typeDefs,
    StudyResolvers: resolvers
};