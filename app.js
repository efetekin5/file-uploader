require('dotenv').config();    
const express = require('express');
const session = require("express-session");
const path = require('path');
const passport = require("passport");
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
require('./config/passport');

const indexRouter = require('./routes/index');

const app = express();

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

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));