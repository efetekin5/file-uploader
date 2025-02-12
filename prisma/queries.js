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

const uploadFileToDB = async (fileName, size, url, folderId, userId, uploadDate, dateLastUpdated) => {
    return await prisma.file.create({
        data: {
            name: fileName,
            size: size,
            url: url,
            folderId: folderId,
            userId: userId,
            createdAt: uploadDate,
            updatedAt: dateLastUpdated
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

const getFile = async (fileId) => {
    return await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })
}

const deleteFile = async (fileId) => {
    return await prisma.file.delete({
        where: {
            id: fileId
        }
    })
}

const deleteFolder = async (folderId) => {
    return await prisma.folder.delete({
        where: {
            id: folderId
        }
    })
}

const deleteChildFiles = async (folderId) => {
    return await prisma.file.deleteMany({
        where: {
            folderId: folderId
        }
    })
}

const deleteChildFolders = async (folderId) => {
    return await prisma.folder.deleteMany({
        where: {
            parentId: folderId
        }
    })
}

const editFile = async (fileId, fileName, fileSize, fileCreatedAt, fileLastUpdated) => {
    return await prisma.file.update({
        where: {
            id: fileId
        },
        data: {
            name: fileName,
            size: fileSize,
            createdAt: fileCreatedAt,
            updatedAt: fileLastUpdated
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
    getFolder,
    getFile,
    deleteFile,
    deleteFolder,
    deleteChildFiles,
    deleteChildFolders,
    editFile
};