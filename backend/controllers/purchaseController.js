const {
  CourseDetails,
  Student_Purchases,
  Accounts,
  Course_Section,
  Quiz,
  Progress,
  Instructor,
} = require("../models/usermodels");

const learningpurchase = async (req, res) => {
  try {
    const { course_name, course_description, video_url,username} =
      req.body;

    // First, find the user based on their username
    const user = await Accounts.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Next, find the course based on its name
    const course = await CourseDetails.findOne({
      where: { name: course_name },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user has already purchased this course
    const existingPurchase = await Student_Purchases.findOne({
      where: {
        student_id: user.id,
        course_id: course.id,
      },
    });

    if (existingPurchase) {
      // Course has already been purchased by the user
      return res.status(200).json({ message: "Course already purchased" });
    }

    // If the user hasn't purchased the course, create a new purchase record
    await Student_Purchases.create({
      course_name,
      course_description,
      video_url,
      student_id: user.id,
      student_name:username,
      course_id: course.id,
    });

    // Return a success response
    return res.status(201).json({ message: "Course purchased successfully" });
  } catch (error) {
    console.error("Error creating a CourseDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const purchased = async (req, res) => {
  try {
    const username = req.query.student_name;

    const courseName = req.query.course_name;

    // Try to find the course
    const purchasedCourse = await Student_Purchases.findOne({
      where: {
        course_name: courseName,
        username: username,
      },
    });

    if (purchasedCourse) {
      // Course exists in the database
      res.status(200).json({ message: "Success" });
    } else {
      // Course doesn't exist
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { learningpurchase, purchased };
