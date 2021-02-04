/*
Defines all the Scheme for Product related GraphQL functions
*/
const { gql, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { IdError, PermissionsError } = require('../func/errors');
const database = require('../database');
const mongo = require('mongodb');
const studyHelper = require('../func/study');
const permissions = require('../func/permissionsChecker');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    input QuestionInput{
        qType: String!
        order: Int!
        message: String!
        description: String!
        values: [String]!
        required: Boolean!
    }

    input QuestionnaireInput{
        title: String!
        description: String!
        studyID: ID!
    }

    input updateQuestion{
        questionID: ID!
        qType: String
        order: Int
        message: String
        description: String
        values: [String]
        required: Boolean
    }

    "Represents details of a question"
    type Question{
        qID: ID
        qType: String
        order: Int
        message: String
        description: String
        values: [String]
        required: Boolean
    }

    "Represents details of a questionnaire"
    type Questionnaire{
        id: ID
        title: String
        description: String
        "Study is only returned if user is logged in"
        study: Study
        questions: [Question]
    }

    extend type Query {
        "returns a questionnaire"
        getQuestionnaire(id:ID!): Questionnaire
        "returns all questionnaires in the system"
        getQuestionnaires: [Questionnaire]
        "Returns all the questionnaires in a study"
        getStudyQuestionnaires(studyID: ID!): [Questionnaire]
    }

    extend type Mutation {
        "Create a new Questionnaire"
        createQuestionnaire(
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
        "edit a question in a Questionnaire"
        editQuestion(
            questionnaireID: ID!
            questionID: ID!
            qType: String
            order: Int
            description: String
            message: String
            values: [String]
            required: Boolean
        ): Questionnaire
        "Batch update multiple questions in a questionnaire"
        batchEditQuestions(
            questionnaireID: ID!
            questions: [updateQuestion]
        ): Questionnaire
    }
`;

// Resolvers define the technique for fetching the types defined in the Schema above
const resolvers = {
    Query: {
        /**
         * Returns a questionnaire using questionnaireID
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        getQuestionnaire: async (parent, arg, ctx, info) => {
            try {
                const QuestionnaireCollection = database.getDb().collection('questionnaires');

                // Creating a ObjectID object and using it for querying the collection to return filtered results
                const q_id = new mongo.ObjectID(arg.id);
                const currQuestionnaire = await QuestionnaireCollection.findOne({ _id: q_id })

                // Checks if exists
                if (currQuestionnaire) {
                    if (ctx.auth) {
                        studyDetails = await studyHelper.getStudy(currQuestionnaire.studyID.oid)
                    } else {
                        studyDetails = null
                    }
                    return {
                        id: currQuestionnaire._id,
                        title: currQuestionnaire.title,
                        description: currQuestionnaire.description,
                        study: studyDetails,
                        questions: currQuestionnaire.questions,
                    }
                } else {
                    throw new IdError(
                        'Invalid ID'
                    )
                }
            }
            catch (err) {
                throw new Error(
                    `Error: ${err}`
                )
            }

        },

        /**
         * Gets all questionnaires
         * @param {Object} parent
         * @param {Object} arg
         * @param {Object} ctx
         * @param {Object} info
         */
        getQuestionnaires: async (parent, arg, ctx, info) => {
            if (ctx.auth) {

                // Checks current users access level
                if (ctx.user.Level >= 2) {
                    try {

                        const QuestionnaireCollection = database.getDb().collection('questionnaires');
                        const questionnaires = await QuestionnaireCollection.find().toArray()
                        var replyList = []

                        // Adds list to array for return
                        for (let x in questionnaires) {
                            replyList.push(
                                {
                                    id: questionnaires[x]._id,
                                    title: questionnaires[x].title,
                                    description: questionnaires[x].description,
                                    study: await studyHelper.getStudy(questionnaires[x].studyID.oid),
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
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        /**
         * Returns questionnaires relative to the study they are connected to
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        getStudyQuestionnaires: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionnaires');
                const StudyCollection = database.getDb().collection('study');
                var s_id = new mongo.ObjectID(arg.studyID);

                //Gets Information if the user has the correct clearance for that study
                if (ctx.user.Level < 2) {
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    const studyDocument = await StudyCollection.findOne({ _id: currQuestionnaire.studyID.oid, staff: mongo.DBRef("users", staff_id) })
                    if (!studyDocument) {
                        throw new ForbiddenError("User not part of study")
                    }
                }
                try {
                    const questionnaires = await QuestionnaireCollection.find({ studyID: mongo.DBRef("study", s_id) }).toArray()
                    var replyList = []
                    for (let x in questionnaires) {
                        replyList.push(
                            {
                                id: questionnaires[x]._id,
                                title: questionnaires[x].title,
                                description: questionnaires[x].description,
                                study: await studyHelper.getStudy(questionnaires[x].studyID.oid),
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
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        }

    },

    Mutation: {
        /**
         * Create a questionnaire
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info  
         */
        createQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const QuestionnaireCollection = database.getDb().collection('questionnaires');
                    const StudyCollection = database.getDb().collection('study');
                    const s_id = new mongo.ObjectID(arg.questionnaire.studyID);
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    const StudyDetails = await StudyCollection.findOne({ "_id": s_id })
                    if (!StudyDetails) {
                        throw new Error("Invalid studyID")
                    }
                    if (ctx.user.Level < 2) {  // If user isn't a admin, we make sure they are apart of the study
                        const studyDocument = await StudyCollection.findOne({ _id: currQuestionnaire.studyID.oid, staff: mongo.DBRef("users", staff_id) })
                        if (!studyDocument) {
                            throw new ForbiddenError("User not part of study")
                        }
                    }
                    // Check if the user has create perms in the study
                    if (ctx.user.Level < StudyDetails.permissions.create) {
                        throw new PermissionsError("Invalid Permissions")
                    }
                    // form data for new study
                    newQuestionnaire = {
                        title: arg.questionnaire.title,
                        description: arg.questionnaire.description,
                        studyID: {
                            $ref: "study",
                            $id: s_id
                        },
                        questions: [],
                    }
                    // insert into the collection
                    const response = await QuestionnaireCollection.insertOne(newQuestionnaire)
                    return {
                        id: response.ops[0]._id,
                        title: response.ops[0].title,
                        description: response.ops[0].description,
                        study: await studyHelper.getStudy(response.ops[0].studyID.$id),
                        questions: response.ops[0].questions
                    }
                } catch (err) {
                    throw new Error(
                        `Internal Error ${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        /**
         * 
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        addQuestion: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                try {
                    const QuestionnaireCollection = database.getDb().collection('questionnaires');
                    const StudyCollection = database.getDb().collection('study');
                    const q_id = new mongo.ObjectID(arg.questionnaireID);
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    if (!currQuestionnaire) {
                        throw new IdError("Invalid questionnaireID")
                    }
                    const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                    if (!studyDetails) {
                        throw new Error("Unable to find linked study")
                    }
                    if (ctx.user.Level < 2) {  // If user isn't a admin, we make sure they are apart of the study
                        const studyDocument = await StudyCollection.findOne({ _id: currQuestionnaire.studyID.oid, staff: mongo.DBRef("users", staff_id) })
                        if (!studyDocument) {
                            throw new ForbiddenError("User not part of study")
                        }
                    }
                    // Check if user has create perms
                    if (ctx.user.Level < studyDetails.permissions.create) {
                        throw new PermissionsError("Invalid Permissions")
                    }
                    // end of perms check
                    // forms new question objct
                    newQuestion = {
                        qID: new mongo.ObjectID(),
                        qType: arg.question.qType,
                        message: arg.question.message,
                        description: arg.question.description,
                        values: arg.question.values,
                        order: arg.question.order,
                        required: arg.required
                    }
                    // insert question into questionnaire
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
                            study: await studyHelper.getStudy(currQuestionnaire.studyID.oid),
                            questions: currQuestionnaire.questions,
                            required: currQuestionnaire.required,
                        }
                    }
                } catch (err) {
                    throw new Error(
                        `internal Error ${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        /**
         * 
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        editQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionnaires');
                const StudyCollection = database.getDb().collection('study');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new IdError("Invalid questionnaireID")
                }
                const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                if (!studyDetails) {
                    throw new Error("Unable to find linked study")
                }
                if (ctx.user.Level < 2) {  // If user isn't a admin, we make sure they are apart of the study
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    const studyDocument = await StudyCollection.findOne({ _id: currQuestionnaire.studyID.oid, staff: mongo.DBRef("users", staff_id) })
                    if (!studyDocument) {
                        throw new ForbiddenError("User not part of study")
                    }
                }
                // Check if user has edit perms
                if (ctx.user.Level < studyDetails.permissions.edit) {
                    throw new PermissionsError("Invalid Permissions")
                }
                // Forms the object with the fields to edit
                var updateField = {}
                if ('title' in arg) {
                    updateField.title = arg.title
                }
                if ('description' in arg) {
                    updateField.description = arg.description
                }
                try {
                    // update object with new details and return
                    const r = await QuestionnaireCollection.updateOne({ "_id": q_id }, { $set: updateField })
                    currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    if (currQuestionnaire) {
                        return {
                            id: currQuestionnaire._id,
                            title: currQuestionnaire.title,
                            description: currQuestionnaire.description,
                            study: await studyHelper.getStudy(currQuestionnaire.studyID.oid),
                            questions: currQuestionnaire.questions,
                        }
                    }
                } catch (err) {
                    throw new Error(
                        `Internal Error ${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        /**
         * 
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        removeQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionnaires');
                const StudyCollection = database.getDb().collection('study');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new IdError("Invalid questionnaireID")
                }
                const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                if (!studyDetails) {
                    throw new Error("Unable to find linked study")
                }
                if (ctx.user.Level < 2) {  // If user isn't a admin, we make sure they are apart of the study
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    const studyDocument = await StudyCollection.findOne({ _id: currQuestionnaire.studyID.oid, staff: mongo.DBRef("users", staff_id) })
                    if (!studyDocument) {
                        throw new ForbiddenError("User not part of study")
                    }
                }
                // Check if user has delete perms
                if (ctx.user.Level < studyDetails.permissions.delete) {
                    throw new PermissionsError("Invalid Permissions")
                }
                try {
                    // delete questionnaire and return its details
                    await QuestionnaireCollection.deleteOne({ "_id": q_id });
                    return {
                        id: currQuestionnaire._id,
                        title: currQuestionnaire.title,
                        description: currQuestionnaire.description,
                        study: await studyHelper.getStudy(currQuestionnaire.studyID.oid),
                        questions: currQuestionnaire.questions,
                    }
                } catch (err) {
                    throw new Error(
                        `Internal error: ${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        /**
         * 
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        removeQuestionFromQuestionnaire: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionnaires');
                const StudyCollection = database.getDb().collection('study');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new IdError("Invalid questionnaireID")
                }
                const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                if (!studyDetails) {
                    throw new Error("Unable to find linked study")
                }
                if (ctx.user.Level < 2) {  // If user isn't a admin, we make sure they are apart of the study
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    const studyDocument = await StudyCollection.findOne({ _id: currQuestionnaire.studyID.oid, staff: mongo.DBRef("users", staff_id) })
                    if (!studyDocument) {
                        throw new ForbiddenError("User not part of study")
                    }
                }
                // Check if user has delete perms
                if (ctx.user.Level < studyDetails.permissions.delete) {
                    throw new PermissionsError("Invalid Permissions")
                }
                var existCheck = false
                const question_id = new mongo.ObjectID(arg.questionID);
                for (let x in currQuestionnaire.questions) {
                    if (currQuestionnaire.questions[x].qID.equals(question_id)) {
                        existCheck = true
                    }
                }
                if (!existCheck) {
                    throw new IdError("Invalid questionID")
                }
                try {
                    // remove question from questionnaire
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
                    // return the questionnaire with updated details
                    currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    return {
                        id: currQuestionnaire._id,
                        title: currQuestionnaire.title,
                        description: currQuestionnaire.description,
                        study: await studyHelper.getStudy(currQuestionnaire.studyID.oid),
                        questions: currQuestionnaire.questions,
                    }
                } catch (err) {
                    throw new Error(
                        `Internal error: ${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },
        /**
         * 
         * @param {Object} parent 
         * @param {Object} arg 
         * @param {Object} ctx 
         * @param {Object} info 
         */
        editQuestion: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const QuestionnaireCollection = database.getDb().collection('questionnaires');
                const StudyCollection = database.getDb().collection('study');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new IdError("Invalid questionnaireID")
                }
                const studyDetails = await StudyCollection.findOne({ "_id": currQuestionnaire.studyID.oid })
                if (!studyDetails) {
                    throw new Error("Unable to find linked study")
                }
                if (ctx.user.Level < 2) {  // If user isn't a admin, we make sure they are apart of the study
                    const staff_id = new mongo.ObjectID(ctx.user.ID);
                    const studyDocument = await StudyCollection.findOne({ _id: currQuestionnaire.studyID.oid, staff: mongo.DBRef("users", staff_id) })
                    if (!studyDocument) {
                        throw new ForbiddenError("User not part of study")
                    }
                }
                // Check if user has edit perms
                if (ctx.user.Level < studyDetails.permissions.delete) {
                    throw new PermissionsError("Invalid Permissions")
                }
                // Check if the question being edited exists
                var existCheck = false
                const question_id = new mongo.ObjectID(arg.questionID);
                for (let x in currQuestionnaire.questions) {
                    if (currQuestionnaire.questions[x].qID.equals(question_id)) {
                        existCheck = true
                    }
                }
                if (!existCheck) {
                    throw new IdError("Invalid questionID")
                }
                try {
                    // for each possible updated fields update the question
                    const question_id = new mongo.ObjectID(arg.questionID);
                    findQuery = { "_id": q_id, "questions.qID": question_id }
                    if ('qType' in arg) {
                        // updateQuestion.qType = arg.qType
                        await QuestionnaireCollection.updateOne(
                            findQuery,
                            { $set: { "questions.$.qType": arg.qType } }
                        )
                    }
                    if ('order' in arg) {
                        // updateQuestion.order - arg.order
                        await QuestionnaireCollection.updateOne(
                            findQuery,
                            { $set: { "questions.$.order": arg.order } }
                        )
                    }
                    if ('message' in arg) {
                        // updateQuestion.message = arg.message
                        await QuestionnaireCollection.updateOne(
                            findQuery,
                            { $set: { "questions.$.message": arg.message } }
                        )
                    }
                    if ('values' in arg) {
                        // updateQuestion.values = arg.values
                        await QuestionnaireCollection.updateOne(
                            findQuery,
                            { $set: { "questions.$.values": arg.values } }
                        )
                    }
                    if ('description' in arg) {
                        // updateQuestion.values = arg.values
                        await QuestionnaireCollection.updateOne(
                            findQuery,
                            { $set: { "questions.$.description": arg.description } }
                        )
                    }
                    if ('required' in arg) {
                        // updateQuestion.values = arg.values
                        await QuestionnaireCollection.updateOne(
                            findQuery,
                            { $set: { "questions.$.required": arg.required } }
                        )
                    }
                    // find questionnaire and return with new details
                    currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    return {
                        id: currQuestionnaire._id,
                        title: currQuestionnaire.title,
                        description: currQuestionnaire.description,
                        study: await studyHelper.getStudy(currQuestionnaire.studyID.oid),
                        questions: currQuestionnaire.questions,
                    }
                } catch (err) {
                    throw new Error(
                        `Internal error: ${err}`
                    )
                }
            } else {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in'
                )
            }
        },

        batchEditQuestions: async (parent, arg, ctx, info) => {
            if (ctx.auth) {
                const editValues = ['qType', 'order', 'message', 'description', 'values', 'required']
                const QuestionnaireCollection = database.getDb().collection('questionnaires');
                const q_id = new mongo.ObjectID(arg.questionnaireID);
                var currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                if (!currQuestionnaire) {
                    throw new IdError("Invalid questionnaireID")
                }
                if (!await permissions.permissionChecker(ctx, currQuestionnaire.studyID.oid, "edit")) {
                    throw ForbiddenError("Invalid Permissions")
                }
                var updateCommands = []  // Holds the updates the the bulkd writes 
                for (let x in arg.questions) {
                    // Check if the question being edited exists
                    var existCheck = false
                    const question_id = new mongo.ObjectID(arg.questions[x].questionID);
                    for (let x in currQuestionnaire.questions) {
                        if (currQuestionnaire.questions[x].qID.equals(question_id)) {
                            existCheck = true
                        }
                    }
                    if (!existCheck) {
                        throw new IdError("Invalid questionID")
                    }
                    console.log(`valid ID ${arg.questionnaireID}`)
                    for (let y in editValues) {
                        const val = editValues[y]
                        if (val in arg.questions[x]) {
                            updateCommands.push({
                                updateOne: {
                                    filter: { "_id": q_id, "questions.qID": question_id },
                                    update: { $set: { [`questions.$.${val}`]: arg.questions[x][val] } }
                                }
                            })
                        }
                    }
                }
                try {
                    console.log(JSON.stringify(updateCommands, null, 4))
                    await QuestionnaireCollection.bulkWrite(updateCommands)
                    currQuestionnaire = await QuestionnaireCollection.findOne({ "_id": q_id })
                    return {
                        id: currQuestionnaire._id,
                        title: currQuestionnaire.title,
                        description: currQuestionnaire.description,
                        study: await studyHelper.getStudy(currQuestionnaire.studyID.oid),
                        questions: currQuestionnaire.questions,
                    }
                }catch(err){
                    throw new Error(`Batch update Error: ${err}`)
                }
            } else {
                throw new AuthenticationError(
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
