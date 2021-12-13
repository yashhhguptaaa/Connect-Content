const Link = require("../models/link");
const slugify = require("slugify");

exports.create = (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  // console.table({title, url, categories, type, medium});
  const slug = url;
  let link = new Link({ title, url, slug, categories, type, medium });

  link.postedBy = req.user._id

  // categories
  let arrayOfCategories = categories && categories.split(',')
  link.categories = arrayOfCategories

    link.save((err, data) => {
        if(err) {
            console.log("Error while saving Link to db:",err)
            return res.status(400).json({
                error : 'Link already exist'
            });
        }
        res.json(data);
    })
};

exports.list = (req, res) => {

    Link.find({}).exec((err, data) => {
        if(err) {
            console.log("Error while getting links from db:",err)
            return res.status(400) .json({
                error : 'Could not list links'
            });
        }
        res.json(data)
    })
};

exports.read = (req, res) => {};

exports.update = (req, res) => {};

exports.remove = (req, res) => {};
