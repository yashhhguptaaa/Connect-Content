const Link = require("../models/link");
const slugify = require("slugify");

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
  });
};

exports.list = (req, res) => {
  Link.find({}).exec((err, data) => {
    if (err) {
      console.log("Error while getting links from db:", err);
      return res.status(400).json({
        error: "Could not list links",
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {};

exports.update = (req, res) => {};

exports.remove = (req, res) => {
  const { id } = req.params;

  Link.findOneAndRemove({ _id:id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not delete link",
      });
    }
    console.log("data: ",data)
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
