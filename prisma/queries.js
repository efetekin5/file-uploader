const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const createNewUser = async (email, password) => {
    return await prisma.user.create({
        data: {
            email: email,
            password: password
        }
    })
}


module.exports = {
    createNewUser,
};