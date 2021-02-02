/*
Handles API for video notes
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError, PermissionsError } = require('../func/errors');
const database = require('../database');
const { DBRef } = require('mongodb');
const mongo = require('mongodb');
const studyHelper = require('../func/study');
const videoHelper = require('../func/videoNote')

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
        study: Study
        title: String
        "Link to the videos used for this study"
        videos: [Video]
        "Notes for this video note"
        notes: [Note]

    
    }

    input VideoInput {
        "Link to video file"
        link: String!
        "type of link"
        type: String!
    }

    input NoteInput {
        "Timestamp to place the note at"
        timeStamp: String!
        "text to store with the video note"
        description: String!
    }

    input VideoNotesInput{
        "ID of the study this video note is to link to"
        studyID: ID!
        "Title of this video note"
        title: String!
        "link to videos"
        videos: [VideoInput]
        "Notes for this videoNote"
        notes: [NoteInput]

    }

    extend type Mutation{
        "Create VideoNotes"
        createVideoNotes(
            videoNotes: VideoNotesInput
        ): VideoNotes
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
                        return await videoHelper.formVideoNote(currNotes)
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
                    if (currNotes) {
                        var noteList = []
                        for (let x in currNotes) {
                            noteList.push(
                                await videoHelper.formVideoNote(currNotes[x])
                            )
                        }
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
    Mutation: {
        /**
         * Add a video note to collection
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        createVideoNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const study_oid = new mongo.ObjectID(arg.videoNotes.studyID)
                const study = await studyHelper.getStudy(study_oid)
                if (!study) {
                    throw new IdError("Invalid studyID")
                }
                try {
                    // Build the arrays for any possible videos and notes
                    var videos = []
                    var notes = []
                    if ('videos' in arg.videoNotes) {
                        for (let x in arg.videoNotes.videos) {
                            videos.push({
                                _id: new mongo.ObjectID(),
                                link: arg.videoNotes.videos[x].link,
                                type: arg.videoNotes.videos[x].type
                            })
                        }
                    }
                    if ('notes' in arg.videoNotes) {
                        for (let y in arg.videoNotes.notes) {
                            notes.push({
                                _id: new mongo.ObjectID(),
                                timeStamp: arg.videoNotes.notes[y].timeStamp,
                                description: arg.videoNotes.notes[y].description
                            })
                        }
                    }
                    // form new document for collection
                    const newVideoNote = {
                        title: arg.videoNotes.title,
                        study: {
                            $ref: "study",
                            $id: study_oid
                        },
                        videos: videos,
                        notes: notes
                    }
                    const response = await NotesCollection.insertOne(newVideoNote)
                    return await videoHelper.formVideoNote(response.ops[0])
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
    }
}

module.exports = {
    VideoNotes: typeDefs,
    VideoNoteResolvers: resolvers
}