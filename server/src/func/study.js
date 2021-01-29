const database = require('../database');
const mongo = require('mongodb');
const { IdError, PermissionsError } = require('../func/errors');
const staffHelper = require('../func/staff')

async function getStudy(studyID) {
    const StudyCollection = database.getDb().collection('study');
    const currStudy = await StudyCollection.findOne({ "_id": studyID })
    if (!currStudy) {
        throw new IdError("Invalid StudyID")
    }
    staffReply = []
    try{
        for (let y in currStudy.staff) {
            staffReply.push(
                await staffHelper.getStaffDetails(currStudy.staff[y].oid)
            )
        }
    }catch(err){
        throw new Error(err)
    }
    return {
        id: currStudy._id,
        title: currStudy.title,
        description: currStudy.description,
        permissions: currStudy.permissions,
        staff: staffReply
    }
}

module.exports = {
    getStudy: getStudy
}