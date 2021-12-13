const { check } = require("express-validator");

exports.linkCreateValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("url").not().isEmpty().withMessage("Url is required"),
  check("categories").not().isEmpty().withMessage("Pick atleast one category"),
  check("type").not().isEmpty().withMessage("Pick a type free/paid"),
  check("medium").not().isEmpty().withMessage("Pick a medium video/book"),
];

exports.linkUpdateValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("url").not().isEmpty().withMessage("Url is required"),
  check("categories").not().isEmpty().withMessage("Pick atleast one category"),
  check("type").not().isEmpty().withMessage("Pick a type free/paid"),
  check("medium").not().isEmpty().withMessage("Pick a medium video/book"),
];