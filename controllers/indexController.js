const asyncHandler = require('express-async-handler');
const dbQueries = require('../prisma/queries')

const homePageGet = asyncHandler(async (req, res, next) => {
    if(req.user) {
        const currentUserInfo = await dbQueries.getCurrentUser(req.user.id)

        res.render('index', {
            folderName: null,
            folders: currentUserInfo.folders
        });
    } else {
        res.redirect('login');
    }
})

module.exports = {
    homePageGet
}