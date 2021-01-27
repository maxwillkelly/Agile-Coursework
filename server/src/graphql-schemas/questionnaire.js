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
        qID: Int!
        qType: Int!
        message: String!
        values: [String]!
    }

    input QuestionnaireInput{
        title: String!
        description: String!
        studyID: ID!
    }

   type Question{
        qID: Int
        qType: Int
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

    # extend type Mutation {

    # }
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
                            studyID: currQuestionnaire.studyID,
                            questions: currQuestionnaire.questions,
                        }
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
                if(ctx.user.level >=2)
                {
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
                                studyID: questionnaires[x].studyID,
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
            else
            {
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
                                studyID: questionnaires[x].studyID,
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
            else
            {
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        }

    },

    // Mutation: {
    // }
};

module.exports = {
    Questionnaire: typeDefs,
    QuestionnaireResolvers: resolvers
};
