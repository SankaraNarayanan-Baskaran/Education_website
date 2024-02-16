const express = require("express");
const router = express.Router();
const multer = require('multer');
const adminController = require("../controllers/adminController");
const decodedToken=require("../utils/Decode");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addadmin", adminController.institution);
router.post("/loginadmin", adminController.loginInstitution);
router.post("/upload-csv",upload.single('csvFile'),adminController.uploadCSV);

router.delete("/user/:id", adminController.deleteUser);
router.delete("/instructor/:id", adminController.deleteInstructor);

router.put("/courses/:courseId/approve", adminController.approve);

router.get("/studentinfo", decodedToken.parseJwt,adminController.studentInfo);
router.get("/instructorinfo", decodedToken.parseJwt,adminController.instructorInfo);
router.get("/icon", decodedToken.parseJwt,adminController.icon);
router.get("/managecourses/:id", adminController.manageStudentCourses);
router.get("/manageinstcourses/:id", adminController.manageInstructorCourses);
router.get("/pending", decodedToken.parseJwt,adminController.pending);
router.get("/studentcourses",decodedToken.parseJwt, adminController.getStudentCourses);
router.get("/instcourses",decodedToken.parseJwt, adminController.getInstructorCourses);
router.get("/data", decodedToken.parseJwt,adminController.data);

module.exports = router;
