const asyncHandler = require('express-async-handler');
const db = require('../prisma/queries');

const uploadFile = asyncHandler(async (req, res, next) => {
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const folderId = req.params.id;
    const fileURL = '.';
    const currentUserId = req.user.id;

    db.uploadFileToDB(fileName, fileSize, fileURL, folderId, currentUserId);
    res.redirect('/');
})

module.exports = {
    uploadFile
}