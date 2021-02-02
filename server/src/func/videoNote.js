const studyHelper = require('../func/study');
/**
 * Helps form the graphQL return for video notes
 * @param {Object} videoNote - notes document from MongoDB database
 */
async function formVideoNote(videoNote){
    return{
        _id: videoNote._id,
        study: await studyHelper.getStudy(videoNote.study.oid),
        title: videoNote.title,
        videos: videoNote.videos,
        notes: videoNote.notes
    }
}

module.exports = {
    formVideoNote: formVideoNote
}