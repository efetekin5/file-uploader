const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

router.post('/create-new', folderController.createFolder);

module.exports = router;