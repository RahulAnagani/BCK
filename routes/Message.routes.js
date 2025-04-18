const express=require("express");
const { body } = require("express-validator");
const messageController=require("../controllers/Message.controller");
const {validateUser}=require("../middlewares/AAth")
const router=express.Router();
router.post("/getChatList",validateUser,messageController.getChatList);
router.post("/getChat",[validateUser,body("otherId").isMongoId()],messageController.getChat)
module.exports=router;