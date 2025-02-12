const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('uploadedFile'), fileController.uploadFile);

router.get('/:fileId/view-file', fileController.viewFileInfo);

router.get('/:fileId/delete', fileController.deleteFile);

router.get('/:fileId/edit', fileController.editFileGet);

router.post('/:fileId/edit', fileController.editFilePost);

module.exports = router;