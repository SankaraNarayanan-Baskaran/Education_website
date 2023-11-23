const express = require("express");
const router = express.Router();
const courseController= require("../controllers/courseController");
router.post("/addcourse",courseController.addcourse);
router.get("/fetchcourses",courseController.fetchcourses)
module.exports=router