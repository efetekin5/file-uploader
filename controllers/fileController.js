const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
const path = require('path');
const fs = require('fs');
const supabase = require('../db/supabase');

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
  const storedFileName = req.file.filename;
  const fileSize = formattedFileSize(req.file.size);
  const folderId = req.body.parentFolderId;
  const currentUserId = req.user.id;

  const timestamp = Date.now();
  const uniqueFileName = `${originalFileName}_${timestamp}`;

  const filePath = path.join(__dirname, '..', 'uploads', storedFileName);
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase
  .storage
  .from('files')
  .upload(uniqueFileName, fileBuffer, {
    contentType: req.file.mimetype,
    upsert: false
  })

  if (error) {
    console.error('Upload error:', error);
  }

  const fileURL = data.path;

  if (folderId === undefined) {
    await db.uploadFileToDB(
      originalFileName,
      storedFileName,
      fileSize,
      fileURL,
      folderId,
      currentUserId
    );
    res.redirect('/');
  } else {
    await db.uploadFileToDB(
      originalFileName,
      storedFileName,
      fileSize,
      fileURL,
      parseInt(folderId),
      currentUserId
    );
    res.redirect(`/folders/${folderId}/view-folder`);
  }
});

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
    fileURL: fileURL,
  });
});

const deleteFile = asyncHandler(async (req, res, next) => {
  const fileId = parseInt(req.params.fileId);
  const file = await db.getFile(fileId);
  const filePath = path.join('uploads', file.storedName);

  await db.deleteFile(fileId);
  fs.unlinkSync(filePath);

  const { data, error } = await supabase
  .storage
  .from('files')
  .remove([file.url])


  if (file.folderId === null) {
    res.redirect('/');
  } else {
    res.redirect(`/folders/${file.folderId}/view-folder`);
  }
});

const editFileGet = asyncHandler(async (req, res, next) => {
  const fileId = parseInt(req.params.fileId);
  const file = await db.getFile(fileId);

  const fileName = file.name;

  res.render('editFile', {
    fileName: fileName,
  });
});

const editFilePost = asyncHandler(async (req, res, next) => {
  const fileId = parseInt(req.params.fileId);
  const file = await db.getFile(fileId);
  const fileName = req.body.fileName;

  await db.editFile(fileId, fileName);
  if (file.folderId === null) {
    res.redirect('/');
  } else {
    res.redirect(`/folders/${file.folderId}/view-folder`);
  }
});

const downloadFile = asyncHandler(async (req, res, next) => {
  const fileId = parseInt(req.params.fileId);
  const file = await db.getFile(fileId);

  const { data, error } = await supabase
  .storage
  .from('files')
  .download(file.url)

  if (error) {
    console.error('Error downloading file:', error.message);
    return res.status(500).send('Error downloading the file');
  }

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
  res.setHeader('Content-Type', data.type);

  res.send(buffer);
});

module.exports = {
  uploadFile,
  viewFileInfo,
  deleteFile,
  editFileGet,
  editFilePost,
  downloadFile,
};
