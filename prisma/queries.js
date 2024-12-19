const prisma = require('./prismaClient');

const createNewUser = async (email, password) => {
    return await prisma.user.create({
        data: {
            email: email,
            password: password
        }
    })
}

const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })
}

module.exports = {
    createNewUser,
    getUserByEmail
};