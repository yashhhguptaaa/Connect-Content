const User = require("../models/user")
const {registerEmailParams} = require("../helpers/email")

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const genUsername = require("unique-username-generator");

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
            4
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