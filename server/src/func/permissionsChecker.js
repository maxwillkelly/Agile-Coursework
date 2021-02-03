const studyHelper = require('../func/study');
const mongo = require('mongodb');


/**
 * Check the permission of a user
 * @param {Object} ctx -Login user context
 * @param {mongo.ObjectID} studyObjectID - ID of the study to check
 * @param {string} permission 
 * @returns {boolean}
 */
async function permissionChecker(ctx, studyObjectID, permission) {
    const study = await studyHelper.getStudy(studyObjectID)
    console.log(study.permissions)
    const staff_id = new mongo.ObjectID(ctx.user.ID);
    for (let x in study.staff) {
        if (study.staff[x].id.equals(staff_id)) {
            if (permission === "read") {
                return true
            } else{
                if (!(permission in study.permissions)) {
                    throw new Error("Invalid Permission Key")
                }
                if (ctx.user.Level >= study.permissions[permission] ) {
                    return true
                } else{
                    return false
                }
            }
        }
    }
    return false
}

module.exports = {
    permissionChecker: permissionChecker
}
