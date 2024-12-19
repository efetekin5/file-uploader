const passport = require('../config/passport');

exports.loginGet = async (req, res, next) => {
    res.render('login');
};

exports.loginPost = [
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
    }),
];
