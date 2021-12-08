const express = require('express')
const router = express.Router()

const {userRegisterValidator, userLoginValidator, forgetPasswordValidator, resetPasswordValidator} = require("../validators/auth");
const {runValidation} = require("../validators");

const {register, registerActivate, login, requireSignIn, forgetPassword, resetPassword} = require('../controllers/auth')

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', registerActivate);
router.post('/login', userLoginValidator, runValidation, login);
router.put('/forgot-password', forgetPasswordValidator, runValidation, forgetPassword);
router.put('/forgot-password', resetPasswordValidator, runValidation, resetPassword);

module.exports =router;