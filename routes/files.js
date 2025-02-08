const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('uploadedFile'), fileController.uploadFile);

module.exports = router;