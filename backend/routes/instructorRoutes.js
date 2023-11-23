const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");
router.post("/adduser",instructorController.adduser);
router.post("/logininst",instructorController.logininst)
module.exports=router