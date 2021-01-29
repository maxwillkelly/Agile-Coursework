const database = require('../database');
const mongo = require('mongodb');
const { IdError, PermissionsError } = require('./errors');
const studyHelper = require('./study')

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

module.exports = {
    getQuestionnaire: getQuestionnaire
}