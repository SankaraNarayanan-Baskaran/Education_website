const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");
const decodedToken=require("../utils/Decode")
router.post("/addinst",instructorController.adduser);
router.post("/logininst",instructorController.logininst);
router.get("/instructorview",decodedToken.parseJwt,instructorController.instructorview);
router.get("/isInstructor",decodedToken.parseJwt,instructorController.isInstructor);
router.post("/convertToInstructor",decodedToken.parseJwt,instructorController.convertToInstructor)
module.exports=router