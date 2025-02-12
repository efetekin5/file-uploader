const asyncHandler = require('express-async-handler');
const db = require('../prisma/queries');

function formattedFileSize(fileSize) {
    let formattedFileSize = '';

    if (fileSize < 1024) {
        formattedFileSize = `${fileSize} bytes`;
    } else if (fileSize < 1024 * 1024) {
        formattedFileSize = `${(fileSize / 1024).toFixed(2)} KB`;
    } else {
        formattedFileSize = `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    }

    return formattedFileSize;
}

const uploadFile = asyncHandler(async (req, res, next) => {
    const fileName = req.file.originalname;
    const fileSize = formattedFileSize(req.file.size);
    const folderId = req.body.parentFolderId;
    const fileURL = '.';
    const currentUserId = req.user.id;
    const uploadDate = new Date(Date.now()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })
    const dateLastUpdated = new Date(Date.now()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })

    if(folderId === undefined) {
        db.uploadFileToDB(fileName, fileSize, fileURL, folderId, currentUserId, uploadDate, dateLastUpdated);
        res.redirect('/');
    } else {
        db.uploadFileToDB(fileName, fileSize, fileURL, parseInt(folderId), currentUserId);
        res.redirect(`/folders/${folderId}/view-folder`);
    }
})

const viewFileInfo = asyncHandler(async (req, res, next) => {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId);
    
    const fileCreatedAt = file.createdAt;
    const fileLastUpdated = file.updatedAt;
    const fileName = file.name;
    const fileSize = file.size;
    const fileURL = file.url;

    res.render('fileInfo', {
        fileCreatedAt: fileCreatedAt,
        fileLastUpdated: fileLastUpdated,
        fileName: fileName,
        fileSize: fileSize,
        fileURL: fileURL
    })
})

const deleteFile = asyncHandler(async (req, res, next) => {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId);

    if(file.folderId === null) {
        await db.deleteFile(fileId);
        res.redirect('/');
    } else {
        await db.deleteFile(fileId);
        res.redirect(`/folders/${file.folderId}/view-folder`);
    }
})

const editFileGet = asyncHandler(async (req, res, next) => {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId);

    const fileCreatedAt = file.createdAt;
    const fileLastUpdated = file.updatedAt;
    const fileName = file.name;
    const fileSize = file.size;

    res.render('editFile', {
        fileCreatedAt: fileCreatedAt,
        fileLastUpdated: fileLastUpdated,
        fileName: fileName,
        fileSize: fileSize
    });
})

const editFilePost = asyncHandler(async (req, res, next) => {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId)
    const fileName = req.body.fileName;
    const fileSize = req.body.fileSize;
    const fileCreatedAt = req.body.fileCreatedAt;
    const fileLastUpdated = new Date(Date.now()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    await db.editFile(fileId, fileName, fileSize, fileCreatedAt, fileLastUpdated);
    if(file.folderId === null) {
        res.redirect('/');
    } else {
        res.redirect(`/folders/${file.folderId}/view-folder`);
    }
})

module.exports = {
    uploadFile,
    viewFileInfo,
    deleteFile,
    editFileGet,
    editFilePost
}