const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.post("/addstudent",studentController.adduser);
router.post("/loginuser",studentController.loginuser);
router.post("/google",studentController.google);
router.post("/convertToStudent",studentController.convertToStudent);

router.get("/studentview",studentController.studentview);
router.get("/learners",studentController.learners);
router.get("/isStudent",studentController.isStudent);

router.put("/updatePass",studentController.updatePassword);
router.put("/forgotPass",studentController.forgotPassword)
module.exports=router