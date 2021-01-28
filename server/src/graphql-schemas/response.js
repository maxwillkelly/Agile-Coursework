/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError } = require('../func/errors');
const database = require('../database');
const mongo = require('mongodb');
const questionnaireHelper = require('../func/questionnaire')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

input rValuesInput{
    qID: ID!
    values: [String]!
}

input ResponseInput{
    questionnaireID: ID!
    answers: [rValuesInput]
}

"Value of a question response"
type rValues{
    qID: ID
    values: [String]
}

"Represents details of a response"
type Response{
    id: ID
    questionnaire: Questionnaire
    answers: [rValues]
}

extend type Query {
    "Get a response using ID of a response"
    getResponse(id:ID!): Response
    getResponses(questionnaireID: ID!): [Response]
}

extend type Mutation{
    "Deletes are response"
    deleteResponse(id:ID!): Response
    "Create a response"
    createResponse(
        response: ResponseInput!
    ): Response
}
`;

const resolvers = {

    Query: {
        getResponse: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const ResponseCollection = database.getDb().collection('responses');
                    try {
                        var r_id = new mongo.ObjectID(arg.id);

                        const currResponse = await ResponseCollection.findOne({ "_id": r_id })

                        if (currResponse) {
                            return {
                                id: currResponse._id,
                                questionnaire: await questionnaireHelper.getQuestionnaire(currResponse.questionnaireID),
                                answers: currResponse.answers
                            }
                        }
                        else {
                            throw new Error(
                                "Response doesn't exist"
                            )
                        }
                    }
                    catch (err) {
                        throw new IdError(
                            `Invalid or nonexistent ID : ${err}`
                        )
                    }
                }
                catch (err) {
                    throw new Error(
                        `Error: ${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        getResponses: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const ResponseCollection = database.getDb().collection('responses');
                    var q_id = new mongo.ObjectID(arg.questionnaireID)
                    const responses = await ResponseCollection.find({ questionnaireID: mongo.DBRef("questionaires", q_id) }).toArray();
                    var responseList = []
                    if (responses) {
                        for(let y in responses){
                            responseList.push({
                                id: responses[y]._id,
                                questionnaire: await questionnaireHelper.getQuestionnaire(responses[y].questionnaireID.oid),
                                answers: responses[y].answers
                            })
                        }
                        return responseList
                    } else {
                        throw new Error(`No responses found`)
                    }
                }
                catch (err) {
                    `Error bro: ${err}`
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        }
    },

    Mutation: {
        deleteResponse: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const ResponseCollection = database.getDb().collection('responses');
                    var r_id = new mongo.ObjectID(arg.id);
                    const currResponse = await ResponseCollection.findOne({ _id: r_id });
                    if (currResponse) {
                        await ResponseCollection.deleteOne({ _id: r_id });

                        return {
                            id: currResponse._id,
                            questionnaire: await questionnaireHelper.getQuestionnaire(currResponse.questionnaireID),
                            answers: currResponse.answers
                        }
                    } else {
                        throw new Error("Response doesn't exists");
                    }
                } catch (err) {
                    throw new Error(`Internal error: ${err}`)
                }
            } else {
                throw new AuthenticationError('Authentication token is invalid, please log in');
            }
        },

        createResponse: async (parent, arg, ctx, info) => {
            const ResponseCollection = database.getDb().collection('responses');
            const QuestionnaireCollection = database.getDb().collection('questionnaires');
            const q_id = new mongo.ObjectID(arg.response.questionnaireID);
            const currQuestionnaire = await QuestionnaireCollection.findOne({ _id: q_id })
            if (!currQuestionnaire) {
                throw new IdError("Invalid QuestionnaireID")
            }
            var answerID = []
            for (let x in arg.response.answers) {
                answerID.push(new mongo.ObjectID(arg.response.answers[x].qID))
            }
            //Check if number of questions match
            if (answerID.length != (currQuestionnaire.questions).length) {
                throw new Error('No. answers sent does not match')
            }
            // Goes through the questions in the questionnaire and removes 
            for (let y in currQuestionnaire.questions) {
                answerID = answerID.filter(
                    answerID => {
                        return !answerID.equals(currQuestionnaire.questions[y].qID)
                    }
                )
            }
            if (answerID.length > 0) {
                throw new Error("Invalid question ID sent")
            }
            try {
                const newDocument = {
                    questionnaireID: {
                        $ref: "questionnaires",
                        $id: q_id
                    },
                    answers: []
                }
                for (let x in arg.response.answers) {
                    newDocument.answers.push({
                        qID: new mongo.ObjectID(arg.response.answers[x].qID),
                        values: arg.response.answers[x].values
                    })
                }
                const response = await ResponseCollection.insertOne(newDocument)
                return {
                    id: response.ops[0]._id,
                    questionnaire: await questionnaireHelper.getQuestionnaire(q_id),
                    answers: newDocument.answers,
                }
            } catch (err) {
                throw new Error(
                    `Internal Error ${err}`
                )
            }
        }
    }


};

module.exports = {
    Response: typeDefs,
    ResponseResolvers: resolvers
}




