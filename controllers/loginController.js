const passport = require('../config/passport');

const loginGet = async (req, res, next) => {
    res.render('login', {
      errorMessage: null
    });
};




const loginPost = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.render('login', { errorMessage: info.message });
      }
      req.logIn(user, (err) => {
          if (err) {
              return next(err);
          }
          return res.redirect('/');
      });
  })(req, res, next);
};

module.exports = {
  loginGet,
  loginPost
}