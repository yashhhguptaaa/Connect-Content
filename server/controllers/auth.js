const User = require("../models/user")
const Link = require("../models/link")
const {registerEmailParams, forgotPasswordEmailParams} = require("../helpers/email")

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const genUsername = require("unique-username-generator");
const expressJwt = require('express-jwt')
const _ = require('lodash')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
    // console.log('REGISTER CONTROLLER', req.body);
    const { name, email, password } = req.body;
    let token;

    // check if user exists in our db
    User.findOne({email}).exec((err,user) => {
        if(user){
            return res.status(400).json({
                error : "Email is taken"
            })
        }

        // generate token with user name, email and password
        token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION,{
            expiresIn: '10m'
        });

        // send email
        const params = registerEmailParams(email,token)
    
        const sendEmailOnRegister = ses.sendEmail(params).promise();
    
        sendEmailOnRegister
            .then(data => {
                console.log('email submitted to SES', data);
                res.json({
                    message : `Email has been sent to ${email} ,Follow the instructions to complete your registration`
                })
            })
            .catch(error => {
                console.log('ses email on register', error);
                res.json({
                    message : `We could not verify your email. Please try again`
                })
            });

    })
};

exports.registerActivate = (req, res) => {
    const {token} = req.body;
    // console.log(token)
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded){
        if(err){
            return res.status(401).json({
                error :'Link Expired. Try again'
            });
        }

        const {name, email, password} = jwt.decode(token);
        // const username = shortid.generate()
        const username = genUsername.generateFromEmail(
            email,
            1
          );
          
        User.findOne({email}).exec((err,user) => {
            if(user) {
                return res.status(401).json({
                    error: 'Email is taken'
                })
            }

            //Register new User
            const newUser = new User({username, name, email, password})
            newUser.save((err,result) => {
                if(err){
                    return res.status(401).json({
                        error: 'Error while saving user. Try Later'
                    });
                }
                return res.json({
                    message :'Registration Successfully Done. Please Login'
                })
            })
        })
    })
};

exports.login = (req, res) => {

    const { email, password } = req.body;
   
    User.findOne({email}).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error : 'User with this email does not exist. Please register.'
            })
        }

        // authenticate
        if(!user.authenticate(password)){
            return res.status(400).json({
                error : 'Email and Password do not match'
            })
        }

        // generate token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })  
        const {_id, name, email, role } = user;
        
        return res.json({
            message : 'Logged In successfully',
            token, user: {_id, name, email, role}
        })
    })
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET ,algorithms: ['HS256']}); // req.user

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findOne({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findOne({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            });
        }

        req.profile = user;
        next();
    });
};

exports.forgetPassword = (req,res) => {
    const {email} = req.body;

    // Check if user exists with that email

    User.findOne({email}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error : 'User with that email does not exist'
            });
        }
        // generate token and email to user
        const token = jwt.sign({name : user.name}, process.env.JWT_RESET_PASSWORD, {expiresIn : '10m'})

        // send email
        const params = forgotPasswordEmailParams(email, token);

        // populate the db > user > resetPasswordLink
        return user.updateOne({resetPasswordLink : token}, (err, success) => {
            if(err) {
                return res.status(400).json({
                    error : 'Password reset failed. Please try Later.'
                });
            }
            const sendEmail = ses.sendEmail(params).promise();
            sendEmail
            .then(data => {
                console.log('ses reset password success :-', data)
                return res.json({
                    message : `Email has been sent to ${email}. Check your the email to reset your password.`
                })
            })
            .catch(error => {
                console.log('ses reset pw failed :-',error)
                return res.json({
                    message : `We could not verify your email. Try Later.`
                })
            })
        })

    })
}

exports.resetPassword = (req,res) => {
     const {resetPasswordLink, newPassword} = req.body;
     if(resetPasswordLink) {

        // check for expiry
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, success) => {
            if(err) {
                return res.status(400).json({
                    error : 'Expired Link. Please Try Again'
                })
            }
        })


         User.findOne({resetPasswordLink}).exec((err, user) => {
             if(err || !user) {
                 return res.status(400).json({
                     error : 'Invalid token. Try again'
                 });
             }

             const updatedFields = {
                 password: newPassword,
                 resetPasswordLink : ''
             }

             user = _.extend(user,updatedFields)

             user.save((err, result) => {
                 if(err) {
                     return res.status(400).json({
                         error : 'Password Reset Failed. Try again'
                     })
                 }

                 res.json({
                     message : 'Great! Now you can login with your new password.'
                 })
             })
         })
     }
}

exports.canUpdateDeleteLink = (req, res, next) => {
    const {id} = req.params
    Link.findOne({_id : id}).exec((err, data) => {
        if(err){
            return res.status(400).json({
                error: 'Could not find Link'
            })
        }

        let authorizedUser = data.postedBy._id.toString() === req.user._id.toString()
        if(!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            })
        }
        next()
    })
}
