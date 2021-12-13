const Link = require("../models/link")
const slugify = require('slugify')

exports.create = (req, res) => {
    const {title, url, categories, type, medium} = req.body;
    console.table({title, url, categories, type, medium});
    
}

exports.list = (req, res) => {


}

exports.read = (req, res) => {


}

exports.update = (req, res) => {


}

exports.remove = (req, res) => {


}