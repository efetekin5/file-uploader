const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const queries = require('../prisma/queries')

const signUpGet = (req, res, next) => {
    res.render('sign-up');
}

const userValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email field is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            const user = await queries.getUserByEmail(value);
      
            if (user) {
              throw new Error('Email is already taken');
            }

            return true;
        }),
    body('password')
        .isLength({min: 3}).withMessage('Password must be at least 3 characters long'),
    body('passwordConfirmation').custom((value, {req}) => {
        if(req.body.password != value) {
            throw new Error('Passwords does not match')
        }

        return true;
    }),
]

const signUpPost = [
    userValidation,
    asyncHandler((req, res, next) => {
        const errors = validationResult(req);

        const email = req.body.email
        const password = req.body.password
        const passwordConfirmation = req.body.passwordConfirmation;
        
        if(!errors.isEmpty()) {
            res.render('sign-up', {
                errors: errors.array(),
                email: email,
                password: password,
                passwordConfirmation: passwordConfirmation
            })
        } else {
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if(err) {
                    res.status(500).send('Error hashing the password')
                }

                try {
                    await queries.createNewUser(email, hashedPassword);
                    res.redirect('/login');
                } catch(err) {
                    res.status(500).send('Error trying to save new user')
                }
            })
        }
    })
]

module.exports = {
    signUpGet,
    signUpPost
};