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

    input QuestionInput{
        qType: String!
        message: String!
        values: [String]!
    }

    input QuestionnaireInput{
        title: String!
        description: String!
        studyID: ID!
    }

   type Question{
        qID: ID
        qType: String
        message: String
        values: [String]
   }

    type Questionnaire{
        title: String
        description: String
        studyID: ID
        questions: [Question]
    }

    extend type Query {
        "returns a questionnaire"
        getQuestionnaire(id:ID!): Questionnaire
        getQuestionnaires: [Questionnaire]
        getStudyQuestionnaires(studyID: ID!): [Questionnaire]
    }

    extend type Mutation {
        "Create a new Questionnaire"
        createQuestionair(
            questionnaire: QuestionnaireInput!
        ): Questionnaire
        "Remove as questionnaire"
        removeQuestionnaire(
            questionnaireID: ID!
        ): Questionnaire
        "Add a question in Questionnaire"
        addQuestion(
            questionnaireID: ID!
            question: QuestionInput!
        ): Questionnaire
        "edit basic details of a Questionnaire"
        editQuestionnaire(
            questionnaireID: ID!
            title: String
            description: String
        ): Questionnaire
        "Remove question from Questionnaire"
        removeQuestionFromQuestionnaire(
            questionnaireID: ID!
            questionID: ID!
        ): Questionnaire
    }
`;

// Resolvers define the technique for fetching the types defined in the Schema above
const resolvers = {
    Query: {

        getQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const QuestionnaireCollection = database.getDb().collection('questionaires');
                    var q_id = new mongo.ObjectID(arg.id);
                    const currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    if (currQuestionnaire) {
                        //add in question support
                        return {
                            id: currQuestionnaire._id,
                            title: currQuestionnaire.title,
                            description: currQuestionnaire.description,
                            studyID: currQuestionnaire.studyID.oid,
                            questions: currQuestionnaire.questions,
                        }
                    } else {
                        throw new Error(
                            'Invalid ID'
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

        getQuestionnaires: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                if (ctx.user.Level >= 2) {
                    try {
                        const QuestionnaireCollection = database.getDb().collection('questionaires');
                        const questionnaires = await QuestionnaireCollection.find().toArray()
                        var replyList = []
                        for (let x in questionnaires) {
                            replyList.push(
                                {
                                    id: questionnaires[x]._id,
                                    title: questionnaires[x].title,
                                    description: questionnaires[x].description,
                                    studyID: questionnaires[x].studyID.oid,
                                    questions: questionnaires[x].questions
                                }
                            )
                        }
                        return replyList
                    } catch (err) {
                        throw new Error(
                            `${err}`
                        )
                    }
                }
                else {
                    throw new ForbiddenError(
                        'Not high enough clearance level'
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        getStudyQuestionnaires: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionaires');
                try {
                    var s_id = arg.studyID;
                    console.log(s_id);
                    const questionnaires = await QuestionnaireCollection.find({ studyID: s_id }).toArray()
                    var replyList = []
                    for (let x in questionnaires) {
                        replyList.push(
                            {
                                id: questionnaires[x]._id,
                                title: questionnaires[x].title,
                                description: questionnaires[x].description,
                                studyID: questionnaires[x].studyID.oid,
                                questions: questionnaires[x].questions
                            }
                        )
                    }
                    return replyList
                } catch (err) {
                    throw new Error(
                        `${err}`
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
        createQuestionair: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const QuestionnaireCollection = database.getDb().collection('questionaires');
                    const StudyCollection = database.getDb().collection('study');
                    const s_id = new mongo.ObjectID(arg.questionnaire.studyID);
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    const StudyDetails = await StudyCollection.findOne({ "_id": s_id })
                    if (!StudyDetails) {
                        throw new Error("Invalid studyID")
                    }
                    var staffInStudy = false
                    for (let x in StudyDetails.staff) {
                        if (StudyDetails.staff[x].oid.equals(staff_id)) {
                            staffInStudy = true
                        }
                    }
                    if (!staffInStudy) {
                        throw new ForbiddenError("User not part of study")
                    }
                    if (ctx.user.Level < StudyDetails.permissions.create) {
                        throw new ForbiddenError("Invalid Permissions")
                    }
                    newQuestionnaire = {
                        title: arg.questionnaire.title,
                        description: arg.questionnaire.description,
                        studyID: {
                            $ref: "study",
                            $id: s_id
                        },
                        questions: [],
                    }
                    const response = await QuestionnaireCollection.insertOne(newQuestionnaire)
                    return {
                        id: response.ops[0]._id,
                        title: response.ops[0].title,
                        description: response.ops[0].description,
                        studyID: response.ops[0].studyID.$id,
                        questions: response.ops[0].questions
                    }
                } catch (err) {
                    throw new Error(
                        `Internal Error ${err}`
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        addQuestion: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const QuestionnaireCollection = database.getDb().collection('questionaires');
                    const StudyCollection = database.getDb().collection('study');
                    const q_id = new mongo.ObjectID(arg.questionnaireID);
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    if (!currQuestionnaire) {
                        throw new Error("Invalid questionnaireID")
                    }
                    const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                    if (!studyDetails) {
                        throw new Error("Unable to find linked study")
                    }
                    var staffInStudy = false
                    for (let x in studyDetails.staff) {
                        if (studyDetails.staff[x].oid.equals(staff_id)) {
                            staffInStudy = true
                        }
                    }
                    if (!staffInStudy) {
                        throw new ForbiddenError("User not part of study")
                    }
                    if (ctx.user.Level < studyDetails.permissions.create) {
                        throw new ForbiddenError("Invalid Permissions")
                    }
                    // end of perms check
                    newQuestion = {
                        qID: new mongo.ObjectID(),
                        qType: arg.question.qType,
                        message: arg.question.message,
                        values: arg.question.values
                    }
                    const response = await QuestionnaireCollection.updateOne(
                        { "_id": q_id },
                        {
                            $addToSet: {
                                questions: newQuestion
                            }
                        }
                    )
                    currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    if (currQuestionnaire) {
                        return {
                            id: currQuestionnaire._id,
                            title: currQuestionnaire.title,
                            description: currQuestionnaire.description,
                            studyID: currQuestionnaire.studyID.oid,
                            questions: currQuestionnaire.questions,
                        }
                    }
                } catch (err) {
                    throw new Error(
                        `internal Error ${err}`
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        editQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionaires');
                const StudyCollection = database.getDb().collection('study');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                const staff_id = new mongo.ObjectID(ctx.user.ID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new Error("Invalid questionnaireID")
                }
                const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                if (!studyDetails) {
                    throw new Error("Unable to find linked study")
                }
                var staffInStudy = false
                for (let x in studyDetails.staff) {
                    if (studyDetails.staff[x].oid.equals(staff_id)) {
                        staffInStudy = true
                    }
                }
                if (!staffInStudy) {
                    throw new ForbiddenError("User not part of study")
                }
                if (ctx.user.Level < studyDetails.permissions.edit) {
                    throw new ForbiddenError("Invalid Permissions")
                }

                var updateField = {}
                if ('title' in arg) {
                    updateField.title = arg.title
                }
                if ('description' in arg) {
                    updateField.description = arg.description
                }
                try {
                    const r = await QuestionnaireCollection.updateOne({ "_id": q_id }, { $set: updateField })
                    currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    if (currQuestionnaire) {
                        return {
                            id: currQuestionnaire._id,
                            title: currQuestionnaire.title,
                            description: currQuestionnaire.description,
                            studyID: currQuestionnaire.studyID.oid,
                            questions: currQuestionnaire.questions,
                        }
                    }
                } catch (err) {
                    throw new Error(
                        `Internal Error ${err}`
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        removeQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionaires');
                const StudyCollection = database.getDb().collection('study');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                const staff_id = new mongo.ObjectID(ctx.user.ID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new Error("Invalid questionnaireID")
                }
                const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                if (!studyDetails) {
                    throw new Error("Unable to find linked study")
                }
                var staffInStudy = false
                for (let x in studyDetails.staff) {
                    if (studyDetails.staff[x].oid.equals(staff_id)) {
                        staffInStudy = true
                    }
                }
                if (!staffInStudy) {
                    throw new ForbiddenError("User not part of study")
                }
                if (ctx.user.Level < studyDetails.permissions.delete) {
                    throw new ForbiddenError("Invalid Permissions")
                }
                try {
                    await QuestionnaireCollection.deleteOne({ "_id": q_id });
                    return {
                        id: currQuestionnaire._id,
                        title: currQuestionnaire.title,
                        description: currQuestionnaire.description,
                        studyID: currQuestionnaire.studyID.oid,
                        questions: currQuestionnaire.questions,
                    }
                } catch (err) {
                    throw new Error(
                        `Internal error: ${err}`
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        removeQuestionFromQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionaires');
                const StudyCollection = database.getDb().collection('study');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                const staff_id = new mongo.ObjectID(ctx.user.ID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new Error("Invalid questionnaireID")
                }
                const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                if (!studyDetails) {
                    throw new Error("Unable to find linked study")
                }
                var staffInStudy = false
                for (let x in studyDetails.staff) {
                    if (studyDetails.staff[x].oid.equals(staff_id)) {
                        staffInStudy = true
                    }
                }
                if (!staffInStudy) {
                    throw new ForbiddenError("User not part of study")
                }
                if (ctx.user.Level < studyDetails.permissions.delete) {
                    throw new ForbiddenError("Invalid Permissions")
                }
                var existCheck = false
                const question_id = new mongo.ObjectID(arg.questionID);
                for (let x in currQuestionnaire.questions) {
                    if (currQuestionnaire.questions[x].qID.equals(question_id)) {
                        existCheck = true
                    }
                }
                if (!existCheck) {
                    throw new Error(
                        "Invalid questionID"
                    )
                }
                try {
                    const response = await QuestionnaireCollection.updateOne(
                        { "_id": q_id },
                        {
                            $pull: {
                                "questions": {
                                    qID: question_id
                                }
                            }
                        }
                    )
                    currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    return {
                        id: currQuestionnaire._id,
                        title: currQuestionnaire.title,
                        description: currQuestionnaire.description,
                        studyID: currQuestionnaire.studyID.oid,
                        questions: currQuestionnaire.questions,
                    }
                } catch (err) {
                    throw new Error(
                        `Internal error: ${err}`
                    )
                }
            } else {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

    }
};

module.exports = {
    Questionnaire: typeDefs,
    QuestionnaireResolvers: resolvers
};
