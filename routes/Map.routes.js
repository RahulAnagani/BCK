const express=require("express");
const router=express.Router();
const {query}=require("express-validator");
const { validateUser } = require("../middlewares/AAth");
const mapController=require("../controllers/Map.controller")
router.get("/locations",validateUser,query("location").trim().isLength({min:3}),mapController.getLocations);
router.get("/getCoords",validateUser,query("placeId").trim().isLength({min:3}),mapController.getCoords);
module.exports=router