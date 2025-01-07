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

module.exports = {
    createNewUser,
    getUserByEmail,
    createNewFolder,
    getCurrentUser
};