const {
    CourseDetails,
    Student_Purchases,
    Accounts,
    Course_Section,
    Quiz,
    Progress,
    Instructor,
  } = require("../models/usermodels");

  const section=async(req,res)=>{
   
        try {
          const {
            section_name,
            section_description,
            img_url,
            course_name,
            username,
            transcript,
          } = req.body;
          console.log(course_name);
          Instructor.findOne({ where: { name: username } }).then(async (user) => {
            await CourseDetails.findOne({ where: { name: course_name } }).then(
              async (course) => {
                await Course_Section.create({
                  section_name,
                  section_description,
                  img_url,
                  Course_id: course.id,
                  Course_name: course_name,
                  transcript,
                });
              }
            );
      
            // console.log(userId);
          });
      
          // res = newCourse;
        } catch (error) {
          console.error("Error creating a CourseDetails:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      
      
  }

  const getSection=async(req,res)=>{
    
        try {
          // console.log("Request:", req.body);
          const param = req.query.course_id;
          console.log("Param543:", param);
          const some = CourseDetails.findOne({
            where: { id: param },
          }).then(
            async (course) => {
              console.log("CourseID:", course.id);
              await Course_Section.findAll({
                where: { Course_id: course.id },
              }).then((section) => {
                console.log("Section:", section);
                res.json(section);
              });
            }
      
            // console.log(details);
            // res.json(details);
          );
        } catch (error) {
          console.log("EEWW", req.query.username);
          console.error("Error fetching details:", error);
          res.status(500).json({ error: "Internal server error" });
        }
    
  }

  const updateSection=async(req,res)=>{
   
        try {
          const { sectionId, section_name, section_description, img_url } = req.body;
          await Course_Section.update(
            {
              img_url,
            },
            {
              where: {
                id: sectionId,
              },
            }
          ).then(() => {
            res.status(201).json({ message: "Success" });
          });
        } catch (error) {
          console.log("Error", error);
        }
      
  }
  module.exports={section,getSection,updateSection}