/*
Contains functions to retreave a user in form of the graphQL scheme
*/
const database = require('../database');
var mongo = require('mongodb');
const { permLevel } = require('../func/permissions')

/**
 * 
 * @param {mongo.ObjectID} id - ID of the staff to return
 */
async function getStaffDetails(id) {
    try {
        const UserCollection = database.getDb().collection('users');
        const o_id = new mongo.ObjectID(id);
        const loginUser = await UserCollection.findOne({ "_id": o_id })
        if (loginUser) {
            return {
                id: loginUser._id,
                firstName: loginUser.firstName,
                lastName: loginUser.lastName,
                level: loginUser.level,
                email: loginUser.email,
                permission: permLevel[loginUser.level]
            }
        }
        else {
            throw new Error(
                "Doesn't exist"
            )
        }

    }
    catch (err) {
        throw new Error(
            `Error: ${err}`
        )
    }
}

module.exports = {
    getStaffDetails: getStaffDetails
}