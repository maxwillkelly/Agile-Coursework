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
const permissions = require('../func/permissionsChecker')

const typeDefs = gql`
    type Note {
        _id: ID
        timeStamp: String
        description: String
    }

    type Video {
        _id: ID
        title: String
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
        title: String!
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
        "Add a note to a videoNote"
        addNoteToVideoNotes(
            "ID of the VideoNotes to add note to"
            videoNotesID: ID!
            note: NoteInput!
        ): VideoNotes
        "Add a video tha VideoNote"
        addVideoToVideoNotes(
            "ID of the VideoNotes to add video to"
            videoNotesID: ID!
            video: VideoInput!
        ): VideoNotes
        "Edit details on VideoNote"
        editVideoNotes(
            "ID of the VideoNotes to edit"
            videoNotesID: ID!
            "new title to use"
            title: String!
        ): VideoNotes
        "Edit the notes in a VideoNotes"
        editNoteInVideoNotes(
            "ID of the VideoNotes to edit"
            videoNotesID: ID!
            "ID of the note to edit"
            noteID: ID!
            timeStamp: String!
            description: String!
        ): VideoNotes
        "Edit a video in a VideoNotes"
        editVideoInVideoNotes(
            "ID of the VideoNotes to edit"
            videoNotesID: ID!
            "ID of the video to edit"
            videoID: ID!
            title: String
            "Link to video file"
            link: String
            "type of link"
            type: String
        ): VideoNotes
        "Delete a video note"
        deleteVideoNote(
            videoNotesID: ID!
        ): VideoNotes
        "delete a video from VideoNote"
        deleteVideofromVideoNote(
            "ID of the VideoNotes to delete"
            videoNotesID: ID!
            "ID of the video to delete"
            videoID: ID!
        ): VideoNotes
        "Delete a note from VideoNote"
        deleteNotefromVideoNote(
            "ID of the VideoNotes to delete"
            videoNotesID: ID!
            "ID of the video to delete"
            noteID: ID!
        ): VideoNotes
    }

    extend type Query{
        "Returns a set of notes"
        getVideoNotes(videoNotesID:ID): VideoNotes,
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
                    var n_id = new mongo.ObjectID(arg.videoNotesID);
                    const currNotes = await NotesCollection.findOne({ "_id": n_id })
                    if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "read")){
                        throw ForbiddenError("Invalid Permissions")
                    }
                    // Returns item if it exists or throws error
                    if (currNotes) {
                        return await videoHelper.formVideoNote(currNotes)
                    }
                    else {
                        throw new IdError("Invalid videoNotesID")
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
                    if(ctx.user.Level < 2){
                        throw new ForbiddenError("Invalid Permissions")
                    }
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
                if(!await permissions.permissionChecker(ctx, study.oid, "create")){
                    throw ForbiddenError("Invalid Permissions")
                }
                try {
                    // Build the arrays for any possible videos and notes
                    var videos = []
                    var notes = []
                    if ('videos' in arg.videoNotes) {
                        for (let x in arg.videoNotes.videos) {
                            videos.push({
                                _id: new mongo.ObjectID(),
                                title: arg.videoNotes.videos[x].title,
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
        },

        /**
         * Add Note to a videoNotes
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        addNoteToVideoNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "create")){
                    throw ForbiddenError("Invalid Permissions")
                }
                try {
                    const response = await NotesCollection.updateOne(
                        { "_id": n_id },
                        {
                            $addToSet: {
                                notes: {
                                    _id: new mongo.ObjectID(),
                                    timeStamp: arg.note.timeStamp,
                                    description: arg.note.description
                                }
                            }
                        }
                    )
                    currNotes = await NotesCollection.findOne({ "_id": n_id })
                    return await videoHelper.formVideoNote(currNotes)
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
         * Add Video to videoNotes
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info
         */
        addVideoToVideoNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "create")){
                    throw ForbiddenError("Invalid Permissions")
                }
                try {
                    const response = await NotesCollection.updateOne(
                        { "_id": n_id },
                        {
                            $addToSet: {
                                videos: {
                                    _id: new mongo.ObjectID(),
                                    title: arg.video.title,
                                    link: arg.video.link,
                                    type: arg.video.type
                                }
                            }
                        }
                    )
                    currNotes = await NotesCollection.findOne({ "_id": n_id })
                    return await videoHelper.formVideoNote(currNotes)
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
         * Edit info of a videoNote
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info
         */
        editVideoNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "edit")){
                    throw ForbiddenError("Invalid Permissions")
                }
                try {
                    updateField = {}
                    if ('title' in arg) {
                        updateField.title = arg.title
                    }
                    const r = await NotesCollection.updateOne({ "_id": n_id }, { $set: updateField })
                    currNotes = await NotesCollection.findOne({ "_id": n_id })
                    return await videoHelper.formVideoNote(currNotes)
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
         * Edit notes in videoNotes
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info
         */
        editNoteInVideoNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "edit")){
                    throw ForbiddenError("Invalid Permissions")
                }
                var existCheck = false
                const note_id = new mongo.ObjectID(arg.noteID);
                for (let x in currNotes.notes) {
                    if (currNotes.notes[x]._id.equals(note_id)) {
                        existCheck = true
                    }
                }
                if (!existCheck) {
                    throw new IdError("Invalid noteID")
                }
                try {
                    const findQuery = { "_id": n_id, "notes._id": note_id }
                    if ("timeStamp" in arg) {
                        await NotesCollection.updateOne(
                            findQuery,
                            { $set: { "notes.$.timeStamp": arg.timeStamp } }
                        )
                    }
                    if ('description' in arg) {
                        await NotesCollection.updateOne(
                            findQuery,
                            { $set: { "notes.$.description": arg.description } }
                        )
                    }
                    currNotes = await NotesCollection.findOne({ "_id": n_id })
                    return await videoHelper.formVideoNote(currNotes)
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
         * edit Video in a videoNote
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        editVideoInVideoNotes: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "edit")){
                    throw ForbiddenError("Invalid Permissions")
                }
                var existCheck = false
                const video_id = new mongo.ObjectID(arg.videoID);
                for (let x in currNotes.videos) {
                    if (currNotes.videos[x]._id.equals(video_id)) {
                        existCheck = true
                    }
                }
                if (!existCheck) {
                    throw new IdError("Invalid videoID")
                }
                try {
                    const findQuery = { "_id": n_id, "videos._id": video_id }
                    if ("link" in arg) {
                        await NotesCollection.updateOne(
                            findQuery,
                            { $set: { "videos.$.link": arg.link } }
                        )
                    }
                    if ("title" in arg) {
                        await NotesCollection.updateOne(
                            findQuery,
                            { $set: { "videos.$.title": arg.title } }
                        )
                    }
                    if ("type" in arg) {
                        await NotesCollection.updateOne(
                            findQuery,
                            { $set: { "videos.$.type": arg.type } }
                        )
                    }
                    currNotes = await NotesCollection.findOne({ "_id": n_id })
                    return await videoHelper.formVideoNote(currNotes)
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
         * Delete VideoNote
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        deleteVideoNote: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "delete")){
                    throw ForbiddenError("Invalid Permissions")
                }
                await NotesCollection.deleteOne({ "_id": n_id })
                return await videoHelper.formVideoNote(currNotes)
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        deleteVideofromVideoNote: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "delete")){
                    throw ForbiddenError("Invalid Permissions")
                }
                var existCheck = false
                const video_id = new mongo.ObjectID(arg.videoID);
                for (let x in currNotes.videos) {
                    if (currNotes.videos[x]._id.equals(video_id)) {
                        existCheck = true
                    }
                }
                if (!existCheck) {
                    throw new IdError("Invalid videoID")
                }
                await NotesCollection.updateOne(
                    { "_id": n_id },
                    {
                        $pull: {
                            "videos": {
                                _id: video_id
                            }
                        }
                    }
                )
                currNotes = await NotesCollection.findOne({ "_id": n_id })
                return await videoHelper.formVideoNote(currNotes)
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        
        deleteNotefromVideoNote: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const NotesCollection = database.getDb().collection('notes');
                const n_id = new mongo.ObjectID(arg.videoNotesID);
                var currNotes = await NotesCollection.findOne({ "_id": n_id })
                if (!currNotes) {
                    throw new IdError("Invalid videoNotesID")
                }
                if(!await permissions.permissionChecker(ctx, currNotes.study.oid, "delete")){
                    throw ForbiddenError("Invalid Permissions")
                }
                var existCheck = false
                const note_id = new mongo.ObjectID(arg.noteID);
                for (let x in currNotes.notes) {
                    if (currNotes.notes[x]._id.equals(note_id)) {
                        existCheck = true
                    }
                }
                if (!existCheck) {
                    throw new IdError("Invalid noteID")
                }
                await NotesCollection.updateOne(
                    { "_id": n_id },
                    {
                        $pull: {
                            "notes": {
                                _id: note_id
                            }
                        }
                    }
                )
                currNotes = await NotesCollection.findOne({ "_id": n_id })
                return await videoHelper.formVideoNote(currNotes)
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

    }
}

module.exports = {
    VideoNotes: typeDefs,
    VideoNoteResolvers: resolvers
}