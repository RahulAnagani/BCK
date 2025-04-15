const express = require("express");
const { validateUser } = require("../middlewares/AAth");
const { body } = require("express-validator");
const RequestController = require("../controllers/RequestController");
const router = express.Router();

router.post("/request", [validateUser, body("toBook").isMongoId()], RequestController.makeRequest);
router.post("/swap", [validateUser, body("fromBook").isMongoId(), body("toBook").isMongoId()], RequestController.makeSwapRequest);
router.get("/sent", validateUser, RequestController.getSentRequests);
router.get("/received", validateUser, RequestController.getReceivedRequests);
router.post("/accept", [validateUser, body("reqId").isMongoId()], RequestController.acceptRequest);
router.post("/decline", [validateUser, body("reqId").isMongoId()], RequestController.declineRequest);
router.post("/cancel", [validateUser, body("reqId").isMongoId()], RequestController.cancelRequest);

module.exports = router
