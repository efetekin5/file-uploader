const asyncHandler = require('express-async-handler');

exports.firstController = asyncHandler(async (req, res, next) => {
    res.render('index');
})