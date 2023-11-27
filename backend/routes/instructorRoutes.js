const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");
router.post("/addinst",instructorController.adduser);
router.post("/logininst",instructorController.logininst);
router.get("/instructorview",instructorController.instructorview);
router.get("/isInstructor",instructorController.isInstructor);
router.post("/convertToInstructor",instructorController.convertToInstructor)
module.exports=router