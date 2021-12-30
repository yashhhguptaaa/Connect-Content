const Link = require("../models/link");
const User = require("../models/user");
const Category = require("../models/category");
const slugify = require("slugify");
const AWS = require("aws-sdk");
const { linkPublishedParams } = require("../helpers/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.create = (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  // console.table({title, url, categories, type, medium});
  const slug = url;
  let link = new Link({ title, url, slug, categories, type, medium });

  link.postedBy = req.user._id;

  link.save((err, data) => {
    if (err) {
      console.log("Error while saving Link to db:", err);
      return res.status(400).json({
        error: "Link already exist",
      });
    }
    res.json(data);

    // find all the users in the category
    User.find({ categories: { $in: categories } }).exec((err, users) => {
      if (err) {
        throw new Error(err);
        console.log("Error finding users to send email on link publish");
      }
      Category.find({ _id: { $in: categories } }).exec((err, result) => {
        data.categories = result;

        for (let i = 0; i < users.length; i++) {
          const params = linkPublishedParams(users[i].email, data);

          const sendEmail = ses.sendEmail(params).promise();

          sendEmail
            .then((success) => {
              console.log("email submitted to SES", success);
              return;
            })
            .catch((failure) => {
              console.log("error on email submitted to SES ", failure);
              return;
            });
        }
      });
    });
  });
};

exports.list = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 1;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Link.find({})
    .populate("postedBy", "name")
    .populate("categories", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec((err, data) => {
      if (err) {
        console.log("Error while getting links from db:", err);
        return res.status(400).json({
          error: "Could not list links",
        });
      }
      res.json(data);
    });
};

exports.read = (req, res) => {
  const { id } = req.params;
  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error finding the link",
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, medium } = req.body;
  const updatedLink = { title, url, categories, type, medium };
  Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: "Error updating the link",
        });
      }
      res.json(updated);
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;

  Link.findOneAndRemove({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not delete link",
      });
    }
    console.log("data: ", data);
    res.json({
      message: "Link deleted successfully",
    });
  });
};

exports.clickCount = (req, res) => {
  const { linkId } = req.body;

  /* $inc means increment , "{clicks: 1}" means clicks by 1 i.e, increment clicks by one */
  /*  "{new: true}" means return the updated one */
  /* The upsert = true option creates the object if it doesn't exist. */
  Link.findByIdAndUpdate(
    linkId,
    { $inc: { clicks: 1 } },
    { upsert: true, new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Could not update view count",
      });
    }
    res.json(result);
  });
};
