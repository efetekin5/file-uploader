const asyncHandler = require('express-async-handler');

exports.firstController = asyncHandler(async (req, res, next) => {
    if(req.user) {
        res.redirect('index');
    } else {
        res.redirect('login');
    }
})