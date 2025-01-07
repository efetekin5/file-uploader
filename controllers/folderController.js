const asyncHandler = require('express-async-handler');
const { validationResult, body } = require('express-validator');
const dbQueries = require('../prisma/queries');

const folderNameValidation = [
    body('newFolderName')
        .notEmpty()
        .withMessage('Folder name is required')
        .trim()
        .escape()
        .isLength({max: 30})
        .withMessage('Folder name can not be longer than 30 characters')
];

const createFolder = [
    folderNameValidation,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const folderName = req.body.newFolderName;
        const parentId = req.params.id;

        if(!errors.isEmpty()) {
            res.render('index', {
                errors: errors.array(),
                folderName: folderName
            })
        } else {
            await dbQueries.createNewFolder(folderName, req.user.id, parentId);
            res.redirect('/');
        }
    })
]

module.exports = {
    createFolder
}