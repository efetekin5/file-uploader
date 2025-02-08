const asyncHandler = require('express-async-handler');
const { validationResult, body } = require('express-validator');
const db = require('../prisma/queries');

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
        const parentId = req.body.parentFolderId;
        
        if(!errors.isEmpty()) {
            res.render('index', {
                errors: errors.array(),
                folderName: folderName
            })
        } else {
            if(parentId === undefined) {
                await db.createNewFolder(folderName, req.user.id, parentId);
                res.redirect('/');
            } else {
                await db.createNewFolder(folderName, req.user.id, parseInt(parentId));
                res.redirect(`/folders/${parentId}/view-folder`);
            }
        }
    })
]


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

function filesAndFoldersCombined(files, folders) {
    const filesWithType = files.map(file => ({
        ...file,
        type: 'file',
    }))

    const foldersWithType = folders.map(folder => ({
        ...folder,
        type: 'folder',
    })) 

    const combinedArray = [...filesWithType, ...foldersWithType];

    return combinedArray.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeA - timeB;
    })
}

const viewChildElements = asyncHandler(async (req, res, next) => {
    const parentFolderId = parseInt(req.params.folderId)
    const parentFolder = await db.getFolder(parentFolderId);
    const files = parentFolder.files;
    const folders = parentFolder.subFolders;

    const formattedFiles = files.map(file => ({
        ...file,
        size: formattedFileSize(file.size)
    }))
    const filesAndFolders = filesAndFoldersCombined(formattedFiles, folders);

    res.render('folderElements', {
        filesAndFolders: filesAndFolders,
        folderName: null,
        parentFolderId: parentFolderId
    })
})

module.exports = {
    createFolder,
    viewChildElements
}