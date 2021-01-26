const database = require('../database');
var mongo = require('mongodb');
const { permLevel } = require('../func/permissions')

async function getStaffDetails(id){
    const UserCollection = database.getDb().collection('users');
    const o_id = new mongo.ObjectID(id);
    const loginUser = await UserCollection.findOne({ "_id": o_id })
    return {
        id: loginUser._id,
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        level: loginUser.level,
        email: loginUser.email,
        permission: permLevel[loginUser.level]
    }
}

module.exports = {
    getStaffDetails:getStaffDetails
}