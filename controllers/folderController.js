const asyncHandler = require('express-async-handler');
const { validationResult, body } = require('express-validator');
const db = require('../db/queries');
const supabase = require('../db/supabase');
const path = require('path');
const fs = require('fs');

const folderNameValidation = [
  body('newFolderName')
    .notEmpty()
    .withMessage('Folder name is required')
    .trim()
    .isLength({ max: 30 })
    .withMessage('Folder name can not be longer than 30 characters'),
];

const createFolder = [
  folderNameValidation,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const folderName = req.body.newFolderName;
    const parentId = req.body.parentFolderId;

    if (!errors.isEmpty()) {
      res.render('index', {
        errors: errors.array(),
        folderName: folderName,
      });
    } else {
      if (parentId === undefined) {
        await db.createNewFolder(folderName, req.user.id, parentId);
        res.redirect('/');
      } else {
        await db.createNewFolder(folderName, req.user.id, parseInt(parentId));
        res.redirect(`/folders/${parentId}/view-folder`);
      }
    }
  }),
];

function filesAndFoldersCombined(files, folders) {
  const filesWithType = files.map((file) => ({
    ...file,
    type: 'file',
  }));

  const foldersWithType = folders.map((folder) => ({
    ...folder,
    type: 'folder',
  }));

  const combinedArray = [...filesWithType, ...foldersWithType];

  return combinedArray.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeA - timeB;
  });
}

const viewChildElements = asyncHandler(async (req, res, next) => {
  const parentFolderId = parseInt(req.params.folderId);
  const parentFolder = await db.getFolder(parentFolderId);
  const files = parentFolder.files;
  const folders = parentFolder.subFolders;

  const filesAndFolders = filesAndFoldersCombined(files, folders);

  res.render('folderElements', {
    filesAndFolders: filesAndFolders,
    folderName: null,
    parentFolderId: parentFolderId,
  });
});

const deleteFolder = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);
  const folder = await db.getFolder(folderId);
  const childFiles = await db.getChildFiles(folderId)

  childFiles.map(async (file) => {
    const { data, error } = await supabase
    .storage
    .from('files')
    .remove([file.url])

    const filePath = path.join('uploads', file.storedName);
    fs.unlinkSync(filePath);
  })
  await db.deleteChildFiles(folderId);

  await db.deleteChildFolders(folderId);
  await db.deleteFolder(folderId);

  if (folder.parentId === null) {
    res.redirect('/');
  } else {
    res.redirect(`/folders/${folder.parentId}/view-folder`);
  }
});

const editFolderGet = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);
  const folder = await db.getFolder(folderId);

  const folderName = folder.name;

  res.render('editFolder', {
    folderName: folderName,
  });
});

const editFolderPost = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);
  const folder = await db.getFolder(folderId);

  const newFolderName = req.body.folderName;

  await db.editFolder(folderId, newFolderName);

  if (folder.parentId === null) {
    res.redirect('/');
  } else {
    res.redirect(`/folders/${folder.parentId}/view-folder`);
  }
});

module.exports = {
  createFolder,
  viewChildElements,
  deleteFolder,
  editFolderGet,
  editFolderPost,
};
