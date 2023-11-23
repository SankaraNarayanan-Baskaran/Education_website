const {CourseDetails,Student_Purchases,Course_Section,Quiz,Progress,Instructor}=require("../models/usermodels")

const addcourse=async(req,res)=>{
    
        try {
          const {
            name,
            description,
            price,
            video_url,
            username,
            course_id,
            category,
            approved,
          } = req.body;
          console.log("Username:", username);
      
          const inst = await Instructor.findOne({ where: { name: username } });
          console.log(inst.institution_code)
          
          if (inst) {
            console.log("165",inst)
            CourseDetails.create({
              name,
              description,
              price,
              video_url,
              user_id: inst.id,
              category,
              approved,
              institution_code: inst.institution_code,
      
              // console.log(userId);
            });
          }
      
          // res = newCourse;
        } catch (error) {
          console.error("Error creating a CourseDetails:", error);
          res.status(500).json({ error: "Internal server error" });
        }
   
      
     
}

const fetchcourses=async(req,res)=>{
   
        try {
          const param = req.query.username;
          // console.log("Param:", param);
          const some = await Instructor.findOne({ where: { name: param } }).then(
            async (users) => {
              // console.log("Userd:",users);
              const details = await CourseDetails.findAll({
                where: { user_id: users.id },
              }).then((course) => {
                console.log("Course:", course);
                res.json(course);
              });
            }
      
            // console.log(details);
            // res.json(details);
          );
        } catch (error) {
          console.log("ERR:", req.query.username);
          console.error("Error fetching details:", error);
          res.status(500).json({ error: "Internal server error" });
        }
    
}
module.exports={addcourse,fetchcourses}
