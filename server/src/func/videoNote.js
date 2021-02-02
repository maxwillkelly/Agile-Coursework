/**
 * Helps form the graphQL return for video notes
 * @param {Object} videoNote - notes document from MongoDB database
 */
function formVideoNote(videoNote){
    return{
        _id: videoNote._id,
        study: videoNote.study.oid,
        title: videoNote.title,
        videos: videoNote.videos,
        notes: videoNote.notes
    }
}

module.exports = {
    formVideoNote: formVideoNote
}