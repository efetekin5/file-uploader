const asyncHandler = require('express-async-handler');

exports.firstController = asyncHandler(async (req, res, next) => {
    if(req.user) {
        res.render('index');
    } else {
        res.redirect('login');
    }
})