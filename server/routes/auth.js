const express = require('express')
const router = express.Router()

router.get('/register',(req,res) => {
    res.json({
        data:"You hit register endpoint"
    })
})

module.exports =router;