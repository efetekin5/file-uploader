const asyncHandler = require('express-async-handler');
const db = require('../prisma/queries');

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

const homePageGet = asyncHandler(async (req, res, next) => {
    if(req.user) {
        const currentUserInfo = await db.getCurrentUser(req.user.id)
        const files = await db.getFiles(req.user.id);
        const formattedFiles = files.map(file => ({
            ...file,
            size: formattedFileSize(file.size)
        }))

        const rootFolders = currentUserInfo.folders.filter((folder) => folder.parentId === null)
        const rootFiles = formattedFiles.filter((file) => file.folderId === null);
        const filesAndFolders = filesAndFoldersCombined(rootFiles, rootFolders);
        console.log(filesAndFolders)
        res.render('index', {
            folderName: null,
            filesAndFolders: filesAndFolders,
        });
    } else {
        res.redirect('login');
    }
})

module.exports = {
    homePageGet
}