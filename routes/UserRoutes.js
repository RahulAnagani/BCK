const express=require("express");
const { body, query } = require("express-validator");
const userController=require("../controllers/User.controller");
const { validateUser } = require("../middlewares/AAth");
const router=express.Router();
router.post("/login",[body("username").trim().isLength({min:3}),body("password").trim().isLength({min:4})],userController.login);
router.post("/register",[body("email").trim().isEmail(),body("username").trim().isLength({min:3}),body("password").trim().isLength({min:4})],userController.register);
router.post("/verifyOtp",[body("email").trim().isEmail(),body("otp").trim().isLength({max:4,min:4})],userController.verifyOtp);
// router.post("/logout",validateUser,userController);
router.get("/getProfile",validateUser,userController.getMyProfile);
router.get("/ValidateToken",validateUser,userController.ValidateToken);
router.get("/search",[validateUser,query("username").notEmpty()],userController.search)
module.exports=router;