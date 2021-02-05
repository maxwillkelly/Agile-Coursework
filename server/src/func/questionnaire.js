/*
Contains functions to retreave a questionnaire in form of the graphQL scheme
*/
const database = require('../database');
const mongo = require('mongodb');
const { IdError, PermissionsError } = require('./errors');
const studyHelper = require('./study')

/**
 * 
 * @param {mongo.ObjectID} questionnaireID - ID of the questionnaire to return
 */
async function getQuestionnaire(questionnaireID) {
    const QuestionnaireCollection = database.getDb().collection('questionnaires');
    const currQuestionnaire = await QuestionnaireCollection.findOne({ _id: questionnaireID })
    if (currQuestionnaire) {
        return {
            id: currQuestionnaire._id,
            title: currQuestionnaire.title,
            description: currQuestionnaire.description,
            study: await studyHelper.getStudy(currQuestionnaire.studyID.oid),
            questions: currQuestionnaire.questions,
        }
    } else {
        throw new IdError('Invalid ID')
    }
}

async function formQuestionnaire(questionnairObject){
    return {
        id: questionnairObject._id,
        title: questionnairObject.title,
        description: questionnairObject.description,
        study: await studyHelper.getStudy(questionnairObject.studyID.oid),
        questions: questionnairObject.questions.sort((a, b) => a.order > b.order ? 1 : -1)
    }
}

module.exports = {
    getQuestionnaire: getQuestionnaire,
    formQuestionnaire: formQuestionnaire
}