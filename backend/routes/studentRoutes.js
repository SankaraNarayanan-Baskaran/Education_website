const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const decodedToken=require("../utils/Decode")
router.post("/addstudent",studentController.adduser);
router.post("/loginstudent",studentController.loginuser);
router.post("/google",studentController.google);
router.post("/convertToStudent",studentController.convertToStudent);

router.get("/studentview",decodedToken.parseJwt,studentController.studentview);
router.get("/learners",studentController.learners);
router.get("/isStudent",decodedToken.parseJwt,studentController.isStudent);
router.get("/publicview",studentController.publicview)

router.put("/updatePass",studentController.updatePassword);
router.put("/forgotPass",studentController.forgotPassword);

module.exports=router