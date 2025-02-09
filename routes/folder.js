const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

router.post('/create-new', folderController.createFolder);

router.get('/:folderId/view-folder', folderController.viewChildElements);

router.get('/:folderId/delete', folderController.deleteFolder);

module.exports = router;