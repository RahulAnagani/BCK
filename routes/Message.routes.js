const express=require("express");
const { body } = require("express-validator");
const router=express.Router;
router.post("sendMessage",[body("receiverId").isMongoId(),body("content").trim().isLength({min:1})],)