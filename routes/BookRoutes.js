const { body, query } = require("express-validator");
const { validateUser } = require("../middlewares/AAth");
const express = require("express");
const router = express.Router();
const BookController = require("../controllers/Book.controller");

router.post("/addBook", validateUser, [body("title").trim().isLength({min:1}), body("author").trim().isLength({min:1}), body("genre").trim().isLength({min:3}), body("condition").trim().isIn(['new', 'good', 'fair', 'poor']), body("isAvailable").isBoolean(), body("location").trim().isLength({min:3}), body("imageUrl"),body("key")], BookController.addBook);
router.post("/removeBook", validateUser, [body("bookId").isMongoId()], BookController.removeBook);
router.get("/getBooks", BookController.getBooks);
router.get("/availability",validateUser,query("okey").trim().isLength({min:3}),BookController.checkAvailability);
module.exports = router;
