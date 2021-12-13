const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");

// Validators
const {
  linkCreateValidator,
  linkUpdateValidator,
} = require("../validators/link");
const { runValidation } = require("../validators/index");

// controllers
const { requireSignIn, authMiddleware } = require("../controllers/auth");
const { create, list, read, update, remove } = require("../controllers/link");

// routes
router.post(
  "/link",
  linkCreateValidator,
  runValidation,
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  // requireSignIn,
  authMiddleware,
  create
);
router.get("/links", list);
router.get("/link/:slug", read);
router.put(
  "/link/:slug",
  linkUpdateValidator,
  runValidation,
  //   requireSignIn,
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  authMiddleware,
  update
);
router.delete(
  "/link/:slug",
  // requireSignIn,
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  authMiddleware,
  remove
);

module.exports = router;
