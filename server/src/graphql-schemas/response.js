/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError } = require('../func/errors');
const database = require('../database');
const mongo = require('mongodb');
const questionnaireHelper = require('../func/questionnaire')
const s3Uploader = require('../func/bucketUpload')
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const moment = require('moment');

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

type QuestionResponse{
    qID: ID
    qType: String
    message: String
    description: String
    order: Int
    values: [String]
    responses: [[String]]
}

extend type Query {
    "Get a response using ID of a response"
    getResponse(id:ID!): Response
    "Get responses relative to a questionnaire"
    getResponses(questionnaireID: ID!): [Response]
    "Get a CSV download link for a questionnaire"
    getCSVOfResponses(
        questionnaireID: ID!
    ): String
    getQuestionResponses(questionnaireID: ID!): [QuestionResponse]
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
        /**
         * Returns the responses tied/sorted by the questions
         * @param {Object} parent
         * @param {Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        getQuestionResponses: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const questionnaire = await questionnaireHelper.getQuestionnaire(new mongo.ObjectID(arg.questionnaireID))
                if(!questionnaire){
                    throw new IdError("Invalid QuestionnaireID")
                }
                const ResponseCollection = database.getDb().collection('responses');
                // Creating a ObjectID object and using it for querying the collection to return filtered results
                var q_id = new mongo.ObjectID(arg.questionnaireID)
                const responses = await ResponseCollection.find({ questionnaireID: mongo.DBRef("questionnaires", q_id) }).toArray();
                if(!responses){
                    throw new Error("No responses for Questionnaire")
                }
                try {
                    replyList = []
                    for (let x in questionnaire.questions){  // For each question
                        const quest = questionnaire.questions[x]
                        const questionID = questionnaire.questions[x].qID
                        var responseList = []
                        for (let y in responses){  // For each reponse
                            // Find the question in the reponse and add it to the working responseList array
                            for (let z in responses[y].answers){
                                if (responses[y].answers[z].qID.equals(questionID)){
                                    responseList.push(responses[y].answers[z].values)
                                    break  // break out of loop early if possible
                                }
                            }
                        }
                        // Post the question with the responses to the reply list
                        replyList.push({
                            qID: questionID,
                            qType: questionnaire.questions[x].qType,
                            message: questionnaire.questions[x].message,
                            description: questionnaire.questions[x].description,
                            values: questionnaire.questions[x].values,
                            order: questionnaire.questions[x].order,
                            responses: responseList
                        })
                    }
                    return(replyList)  // return the questions & reponses
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

        /**
         * Returns a specific response using a responseID as a parameter
         * @param {Object} parent
         * @param {Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        getResponse: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const ResponseCollection = database.getDb().collection('responses');
                    try {
                        // Creating a ObjectID object and using it for querying the collection to return filtered results
                        var r_id = new mongo.ObjectID(arg.id);
                        const currResponse = await ResponseCollection.findOne({ "_id": r_id })

                        // If query is non-null then returns data below
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

        /**
         * Gets all responses meeting the criteria (linked to a questionnaire through questionnaireID)
         * @param {Object} parent
         * @param {Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        getResponses: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const ResponseCollection = database.getDb().collection('responses');

                    // Creating a ObjectID object and using it for querying the collection to return filtered results
                    var q_id = new mongo.ObjectID(arg.questionnaireID)
                    const responses = await ResponseCollection.find({ questionnaireID: mongo.DBRef("questionnaires", q_id) }).toArray();

                    var responseList = []
                    // Iterates through list of responses and adds them to an array to be returned
                    if (responses) {
                        for (let y in responses) {
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
        },

        /**
         * Creates a download link for a csv of responses for a certain questionnaire
         * @param {Object} parent
         * @param {Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        getCSVOfResponses: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const ResponseCollection = database.getDb().collection('responses');

                // Creating a ObjectID object and using it for querying the collection to return filtered results 
                var q_id = new mongo.ObjectID(arg.questionnaireID)
                const responses = await ResponseCollection.find({ questionnaireID: mongo.DBRef("questionnaires", q_id) }).toArray();

                if (responses) {
                    try {
                        const questionnaire = await questionnaireHelper.getQuestionnaire(q_id)
                        if (!questionnaire) {
                            throw new Error("Unable to find questionnaire")
                        }
                        // Forms header for the CSV with the ID of each question and the title of the question 
                        headers = []  // Stores all the header details for the CSV
                        for (let x in questionnaire.questions) {
                            headers.push({
                                id: questionnaire.questions[x].qID.toString(),
                                title: questionnaire.questions[x].message
                            })
                        }
                        // Goes through each response and builds a list of responses with their ID and the value as a key:value paid
                        responseList = []
                        for (let r in responses) {
                            reply = {}
                            for (let a in responses[r].answers) {
                                reply[responses[r].answers[a].qID] = responses[r].answers[a].values
                            }
                            responseList.push(reply)
                        }
                        // Form CSV
                        const csvStringifier = createCsvStringifier({ header: headers });  // Create the stringifyer 
                        const csv = `${csvStringifier.getHeaderString()}${csvStringifier.stringifyRecords(responseList)}`;  // Create the CSV and returns as a string
                        // Uploads to S3 Bucket 
                        const response = await s3Uploader.uploadToS3(
                            `${arg.questionnaireID}-${moment().format('YYYY-MM-DD-HH-mm-ssSS')}.csv`, "text/csv", csv
                        )
                        // Return the link to the uploaded file
                        return `${process.env.LINK}/${response.Key}`
                    } catch (err) {
                        throw new Error(`Intenal Error ${err}`)
                    }
                } else {
                    throw new IdError("Invalid questionnaireID")
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
    },

    Mutation: {
        /**
         * Deletes the response using a responseID as a parameter
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        deleteResponse: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const ResponseCollection = database.getDb().collection('responses');

                    // Creating a ObjectID object and using it for querying the collection to return filtered results 
                    var r_id = new mongo.ObjectID(arg.id);
                    const currResponse = await ResponseCollection.findOne({ _id: r_id });

                    // If exists, the deletes response, else returns null
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

        /**
         * Creates a new response and adds it to the collection
         * @param {Object} parent
         * @param {*Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        createResponse: async (parent, arg, ctx, info) => {
            const ResponseCollection = database.getDb().collection('responses');
            const QuestionnaireCollection = database.getDb().collection('questionnaires');
            const q_id = new mongo.ObjectID(arg.response.questionnaireID);

            //Checks if questionnaire exists
            const currQuestionnaire = await QuestionnaireCollection.findOne({ _id: q_id })
            if (!currQuestionnaire) {
                throw new IdError("Invalid QuestionnaireID")
            }
            var answerID = []
            for (let x in arg.response.answers) {
                answerID.push(new mongo.ObjectID(arg.response.answers[x].qID))
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




