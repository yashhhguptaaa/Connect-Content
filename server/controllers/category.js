const Category = require("../models/category");
const slugify = require("slugify");
const formidable = require("formidable");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

//s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }
    // console.table({err, fields, files})
    const { name, content } = fields;
    const { image } = files;

    const slug = slugify(name);
    let category = new Category({ name, content, slug });

    if (image.size > 2000000) {
      return res.status(400).json({
        error: "Image should be less than 2mb",
      });
    }

    // upload image to s3
    const params = {
      Bucket: "connect-content1",
      Key: `category/${uuidv4()}`,
      Body: fs.readFileSync(image.filepath),
      ACL: "public-read",
      ContentType: "image/jpg",
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.log("err :", err);
        res.status(400).json({ error: "Upload to s3 failed" });
      }

      console.log("AWS UPLOAD RES DATA", data);
      category.image.url = data.Location;
      category.image.key = data.key;

      // save to db
      category.save((err, success) => {
        if (err) {
            console.log("Error while post category: ",err)
          res.status(400).json({ error: "Duplicate Category" });
        }
        return res.json(success);
      });
    });
  });
};

exports.list = (req, res) => {

  Category.find({}).exec((err,data) => {
     if(err) {
       return res.status(400).json({
         error : 'Categories could not load'
       })
     }
     res.json(data)
  })
};


exports.read = (req, res) => {};
exports.update = (req, res) => {};
exports.remove = (req, res) => {};
