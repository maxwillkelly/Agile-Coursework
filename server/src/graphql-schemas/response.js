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

input rValuesInput{
    qID: ID!
    values: [String]!
}

input ResponseInput{
    questionnaireID: ID!
}

type rValues{
    qID: ID
    values: [String]
}

type Response{
    id: ID
    questionnaireID: ID
    responses: [rValues]
}

extend type Query {
    getResponse(id:ID!): Response
    getResponses(questionnaireInputID: ID!): [Response]
}

extend type Mutation{
    deleteResponse(id:ID!): Response
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
                                questionnaireID: currResponse.questionnaireID,
                                responses: currResponse.responses
                            }
                        }
                        else {
                            throw new Error(
                                "Response doesn't exist"
                            )
                        }
                    }
                    catch (err) {
                        throw new Error(
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
                throw new ForbiddenError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        getResponses: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const ResponseCollection = database.getDb().collection('responses');
                    // dbref this shit
                    var q_id = arg.questionnaireInputID
                    console.log(`${q_id} == ${arg.questionnaireInputID}`)
                    const responses = await ResponseCollection.find({ questionnaireID: q_id }).toArray();
                    console.log("----------------------");
                    console.log(responses);
                    console.log("----------------------");
                    var responseList = []
                    if (responses) {
                        for (let x in responses) {
                            responseList.push(
                                {
                                    id: responses[x]._id,
                                    questionnaireID: responses[x].questionnaireID,
                                    responses: responses[x].responses
                                }
                            )
                        }
                        return responseList
                    }
                    else {
                        throw new Error(
                            `What the fuck man`
                        )
                    }
                }
                catch (err) {
                    `Error bro: ${err}`
                }
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
                            questionnaireID: currResponse.questionnaireID,
                            responses: currResponse.responses,
                            action: "completed it mate"
                        }
                    } else {
                        throw new Error("Response doesn't exists");
                    }
                } catch (err) {
                    throw new Error(`Internal error: ${err}`)
                }
            } else {
                throw new ForbiddenError('Authentication token is invalid, please log in');
            }
        }
    }


};

module.exports = {
    Response: typeDefs,
    ResponseResolvers: resolvers
}




