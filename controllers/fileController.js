const asyncHandler = require('express-async-handler');
const db = require('../prisma/queries');
const path = require('path');
const fs = require('fs')

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
    const originalFileName = req.file.originalname;
    const storedFileName = req.file.filename
    const fileSize = formattedFileSize(req.file.size);
    const folderId = req.body.parentFolderId;
    const fileURL = '.';
    const currentUserId = req.user.id;


    if(folderId === undefined) {
        await db.uploadFileToDB(originalFileName, storedFileName, fileSize, fileURL, folderId, currentUserId);
        res.redirect('/');
    } else {
        await db.uploadFileToDB(originalFileName, storedFileName, fileSize, fileURL, parseInt(folderId), currentUserId);
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
    const filePath = path.join('uploads', file.storedName);

    await db.deleteFile(fileId);
    fs.unlinkSync(filePath)


    if(file.folderId === null) {
        res.redirect('/');
    } else {
        res.redirect(`/folders/${file.folderId}/view-folder`);
    }
})

const editFileGet = asyncHandler(async (req, res, next) => {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId);

    const fileName = file.name;

    res.render('editFile', {
        fileName: fileName
    });
})

const editFilePost = asyncHandler(async (req, res, next) => {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId)
    const fileName = req.body.fileName;

    await db.editFile(fileId, fileName);
    if(file.folderId === null) {
        res.redirect('/');
    } else {
        res.redirect(`/folders/${file.folderId}/view-folder`);
    }
})

const downloadFile = asyncHandler(async (req, res, next) => {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId);
    const filePath = path.join('uploads', file.storedName);

    res.download(filePath);
})

module.exports = {
    uploadFile,
    viewFileInfo,
    deleteFile,
    editFileGet,
    editFilePost,
    downloadFile
}