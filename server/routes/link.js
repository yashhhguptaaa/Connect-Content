const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");

// Validator
const {
  linkCreateValidator,
  linkUpdateValidator,
} = require("../validators/link");
const { runValidation } = require("../validators/index");

// controllers
const {
  requireSignIn,
  authMiddleware,
  adminMiddleware,
  canUpdateDeleteLink
} = require("../controllers/auth");

const {
  create,
  list,
  read,
  update,
  remove,
  clickCount,
  popular,
  popularInCategory 
} = require("../controllers/link");

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

router.post(
  "/links", 
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), 
  adminMiddleware, 
  list
);

router.put("/click-count", clickCount);

router.get("/link/popular", popular);

router.get("/link/popular/:slug", popularInCategory);
router.get("/link/:id", read);

router.put(
  "/link/:id",
  linkUpdateValidator,
  runValidation,
  //   requireSignIn,
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  authMiddleware,
  canUpdateDeleteLink,
  update
);

router.put(
  "/link/admin/:id",
  linkUpdateValidator,
  runValidation,
  //   requireSignIn,
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  adminMiddleware,
  update
);

router.delete(
  "/link/:id",
  // requireSignIn,
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  authMiddleware,
  canUpdateDeleteLink,
  remove
);

router.delete(
  "/link/admin/:id",
  // requireSignIn,
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  adminMiddleware,
  remove
);

module.exports = router;
