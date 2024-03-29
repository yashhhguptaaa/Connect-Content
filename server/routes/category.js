const express = require("express");
const router = express.Router();
const expressJwt = require('express-jwt')

// Validators
const {
    categoryCreateValidator,
  categoryUpdateValidator,
} = require("../validators/category");
const { runValidation } = require("../validators/index");

// controllers
const { requireSignIn, adminMiddleware } = require('../controllers/auth');
const {
  create,
  list,
  read,
  update,
  remove,
} = require('../controllers/category');

// routes
router.post(
  '/category',
  categoryCreateValidator,
  runValidation,
  expressJwt({ secret: process.env.JWT_SECRET ,algorithms: ['HS256']}),
// requireSignIn,
  adminMiddleware,
  create
);
router.get("/categories", list);
router.post("/category/:slug", read);
router.put(
  "/category/:slug",
  categoryUpdateValidator,
  runValidation,
//   requireSignIn,
  expressJwt({ secret: process.env.JWT_SECRET ,algorithms: ['HS256']}),
  adminMiddleware,
  update
);
router.delete(
    "/category/:slug", 
    // requireSignIn, 
    expressJwt({ secret: process.env.JWT_SECRET ,algorithms: ['HS256']}),
    adminMiddleware, 
    remove
);

module.exports = router;
