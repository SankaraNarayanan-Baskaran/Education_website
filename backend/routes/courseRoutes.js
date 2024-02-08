const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const purchaseController = require("../controllers/purchaseController");
const sectionController = require("../controllers/sectionController");
const progressController = require("../controllers/progressController");
const quizController=require("../controllers/quizController");
const decode = require("../utils/Decode");

router.post("/addcourse", courseController.addcourse);
router.get("/fetchcourses", courseController.fetchcourses);
router.get("/learning",decode.parseJwt,courseController.learning);
router.get("/search",courseController.search);
router.get("/:courseName/students",courseController.courseName)
router.get("/filter",decode.parseJwt, courseController.filter);

router.post("/learningpurchase", decode.parseJwt,purchaseController.learningpurchase);
router.get("/purchased", purchaseController.purchased);

router.post("/section", sectionController.section);
router.get("/section", sectionController.getSection);
router.post("/updateSection",sectionController.updateSection)

router.post("/progress", decode.parseJwt,progressController.progress);
router.get("/getProgress",decode.parseJwt, progressController.getProgress);

router.post("/quiz",quizController.quiz);
router.get("/quiz",quizController.getQuiz);
router.get("/answer",quizController.answer)

module.exports = router;
