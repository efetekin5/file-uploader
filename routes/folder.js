const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

router.post('/create-new', folderController.createFolder);

router.get('/:folderId/view-folder', folderController.viewChildElements);

router.get('/:folderId/delete', folderController.deleteFolder);

router.get('/:folderId/edit', folderController.editFolderGet);

router.post('/:folderId/edit', folderController.editFolderPost)

module.exports = router;