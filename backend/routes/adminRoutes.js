const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.post("/addadmin", adminController.institution);
router.post("/logininstitution", adminController.loginInstitution);
router.post("/upload-csv", adminController.uploadCSV);

router.delete("/user/:id", adminController.deleteUser);
router.delete("/instructor/:id", adminController.deleteInstructor);

router.put("/courses/:courseId/approve", adminController.approve);

router.get("/studentinfo", adminController.studentInfo);
router.get("/instructorinfo", adminController.instructorInfo);
router.get("/icon", adminController.icon);
router.get("/managecourses/:id", adminController.manageStudentCourses);
router.get("/manageinstcourses/:id", adminController.manageInstructorCourses);
router.get("/pending", adminController.pending);
router.get("/studentcourses", adminController.getStudentCourses);
router.get("/instcourses", adminController.getInstructorCourses);
router.get("/data", adminController.data);

module.exports = router;
