require('dotenv').config();    
const express = require('express');
const session = require("express-session");
const path = require('path');
const passport = require("passport");
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
require('./config/passport');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signUpRouter = require('./routes/signUp');
const logoutRouter = require('./routes/logout');
const folderRouter = require('./routes/folder');

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000
      },
      secret: process.env.secret,
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/sign-up', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/folders', folderRouter);

/*app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found!' });
});

app.use((err, req, res, next) => {
  res.status(500).render('error', { message: 'Something went wrong! Please try again later.' });
});*/

app.listen(3000, () => console.log("app listening on port 3000!"));