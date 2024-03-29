const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");
const decodedToken=require("../utils/Decode")
router.post("/addinstructor",instructorController.adduser);
router.post("/logininstructor",instructorController.logininst);
router.get("/instructorview",decodedToken.parseJwt,instructorController.instructorview);
router.get("/isInstructor",decodedToken.parseJwt,instructorController.isInstructor);
router.post("/convertToInstructor",instructorController.convertToInstructor)
module.exports=router