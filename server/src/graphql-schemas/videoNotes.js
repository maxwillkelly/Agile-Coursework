/*
Handles API for video notes
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError, PermissionsError } = require('../func/errors');
const database = require('../database');
const mongo = require('mongodb');
const studyHelper = require('../func/study');

const typeDefs = gql`
    type Note {
        id: ID
        timeStamp: String
        description: String
    }

    type Video {
        _id: ID
        "Link to video"
        link: String
        "type of link it is (can be ignored atm)"
        type: String
    }

    type VideoNotes {
        _id: ID
        title: String
        "Link to the videos used for this study"
        videos: [Video]
        "Notes for this video note"
        notes: [Note]
    }
`;

const resolvers = {
    Query: {},
    Mutation:{}
}

module.exports = {
    VideoNotes: typeDefs,
    VideoNoteResolvers: resolvers
}