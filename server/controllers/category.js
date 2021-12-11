const Category = require('../models/category')
const slugify = require('slugify')


exports.create = (req, res) => {
    const {name, content} = req.body
    const slug = slugify(name)
    const image = {
        url : `https://via.placeholder.com/200X150.png?text=${process.env.CLIENT_URL}`,
        key : '123'
    };

    const category = new Category({name, slug, image, content})
    category.postedBy = req.user._id

    category.save((err, data) => {
        if(err) {
            console.log('CATEGORY CREATE ERR', err)
            return res.status(400).json({
                error : 'Category create failed'
            })
        }

        res.json(data)
    })
};

exports.list = (req, res) => {};
exports.read = (req, res) => {};
exports.update = (req, res) => {};
exports.remove = (req, res) => {};
