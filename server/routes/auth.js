const express = require('express')
const router = express.Router()

const {userRegisterValidator} = require("../validators/auth");
const {runValidation} = require("../validators");

const {register} = require('../controllers/auth')

router.post('/register', userRegisterValidator, runValidation, register);

module.exports =router;