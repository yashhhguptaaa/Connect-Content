const express = require('express')
const morgan= require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express()
const authRoutes = require('./routes/auth')

//app middlewares
app.use(morgan('dev'));
// app.use(cors())
app.use(cors({origin: process.env.CLIENT_URL}));

app.use('/api',authRoutes)


const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Server is running on port : ${port}`))