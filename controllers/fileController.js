const asyncHandler = require('express-async-handler');
const db = require('../prisma/queries');

const uploadFile = asyncHandler(async (req, res, next) => {
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const folderId = req.body.parentFolderId;
    const fileURL = '.';
    const currentUserId = req.user.id;

    if(folderId === undefined) {
        db.uploadFileToDB(fileName, fileSize, fileURL, folderId, currentUserId);
        res.redirect('/');
    } else {
        db.uploadFileToDB(fileName, fileSize, fileURL, parseInt(folderId), currentUserId);
        res.redirect(`/folders/${folderId}/view-folder`);
    }
})

module.exports = {
    uploadFile
}