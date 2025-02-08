const prisma = require('./prismaClient');

const createNewUser = async (email, password) => {
    return await prisma.user.create({
        data: {
            email: email,
            password: password
        }
    })
};

const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })
};

const createNewFolder = async(folderName, userId, parentId) => {
    return await prisma.folder.create({
        data: {
            name: folderName,
            userId: userId,
            parentId: parentId
        }
    })
};

const getCurrentUser = async (userId) => {
    return await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            folders: true
        }
    })
};

const uploadFileToDB = async (fileName, size, url, folderId, userId) => {
    return await prisma.file.create({
        data: {
            name: fileName,
            size: size,
            url: url,
            folderId: folderId,
            userId: userId
        }
    })
}

const getFiles = async (userId) => {
    return await prisma.file.findMany({
        where: {
            userId: userId
        }
    });
}

const getFolder = async (folderId) => {
    return await prisma.folder.findUnique({
        where: {
            id: folderId
        },
        include: {
            subFolders: true,
            files: true
        }
    })
}

module.exports = {
    createNewUser,
    getUserByEmail,
    createNewFolder,
    getCurrentUser,
    uploadFileToDB,
    getFiles,
    getFolder
};