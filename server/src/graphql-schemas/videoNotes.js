/*
Handles API for video notes
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError, PermissionsError } = require('../func/errors');
const database = require('../database');
const { DBRef } = require('mongodb');
const mongo = require('mongodb');
const studyHelper = require('../func/study');
const { getStudy } = require('../func/study');

const typeDefs = gql`
    type Note {
        _id: ID
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

    extend type Query{
        "Returns a set of notes"
        getVideoNotes(notesID:ID): VideoNotes,
        getStudyNotes(studyID:ID): [VideoNotes]
    }
`;

const resolvers = {
    Query: {
        /**
         * Returns a VideoNotes object using an ID
         * @param {Object} parent
         * @param {Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        getVideoNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const NotesCollection = database.getDb().collection('notes');
                    var n_id = new mongo.ObjectID(arg.notesID);
                    const currNotes = await NotesCollection.findOne({ "_id": n_id })

                    // Returns item if it exists or throws error
                    if (currNotes) {
                        return {
                            _id: currNotes._id,
                            title: currNotes.title,
                            study: currNotes.study,
                            videos: currNotes.videos,
                            notes: currNotes.notes
                        }
                    }
                    else {
                        throw new Error(
                            "Notes don't exist"
                        )
                    }
                }
                catch (err) {
                    throw new Error(
                        `${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        /**
         * Returns all videoNote objects related to a study using studyID
         * @param {Object} parent
         * @param {Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        getStudyNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const NotesCollection = database.getDb().collection('notes');
                    var s_id = new mongo.ObjectID(arg.studyID);
                    const currNotes = await NotesCollection.find({ study: DBRef("study", s_id) }).toArray()
                    console.log("============================")
                    console.log(currNotes)
                    if (currNotes) {
                        var noteList = []
                        for (let x in currNotes) {
                            noteList.push(
                                currNotes[x]
                            )
                        }
                        console.log("-----------------------------")
                        console.log(noteList)
                        return noteList
                    }
                    else {
                        throw new Error(
                            `Study doesn't exist or has no related videoNotes`
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
        }

    },
    Mutation: {}
}

module.exports = {
    VideoNotes: typeDefs,
    VideoNoteResolvers: resolvers
}