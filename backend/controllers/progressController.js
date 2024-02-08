const {
    CourseDetails,
    Student_Purchases,
    Accounts,
    Course_Section,
    Quiz,
    Progress,
    Instructor,
  } = require("../models/usermodels");
const progress=async(req,res)=>{

    try {
      const { sectionId,count } = req.body;
      const usenrame=req.username;
      const user = await Accounts.findOne({ where: { username: username } });
  
      if (user) {
        const section = await Course_Section.findOne({
          where: { id: sectionId },
        });
  
        if (section) {
          const purchase = await Student_Purchases.findOne({
            where: { course_id: section.Course_id, student_id: user.id },
          });
  
          if (purchase) {
            const prog = await Progress.findOne({
              where: {
                student_id: purchase.student_id,
                course_id: purchase.course_id,
              },
            });
  
            if (prog) {
              // Get the current completed sections and update it
              let completedSections = prog.Completed_Sections || [];
  
              // If the sectionId is not already in the completedSections, add it
              if (!completedSections.includes(sectionId)) {
                completedSections.push(sectionId);
              }
  
              // Update the progress and completed sections
              const completedCount = prog.Completed_Sections.length;
              const progress = Math.trunc((completedCount * 100) / count);
              await Progress.update(
                {
                  progress: progress,
                  Completed_Sections: completedSections,
                },
                {
                  where: {
                    student_id: purchase.student_id,
                    course_id: purchase.course_id,
                  },
                }
              );
            } else {
              // If there is no progress record, create one
  
              const first = await Progress.create({
                student_id: purchase.student_id,
                course_id: purchase.course_id,
  
                Completed_Sections: [sectionId],
              });
              if (first) {
                const completedCount = prog.Completed_Sections.length;
                const progress = Math.trunc((completedCount * 100) / count);
                await Progress.update({
                  student_id: purchase.student_id,
                  course_id: purchase.course_id,
                  progress: progress,
                });
              }
            }
  
            res.status(200).send("Progress recorded successfully");
          } else {
            res.status(404).send("Purchase not found");
          }
        } else {
          res.status(404).send("Section not found");
        }
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.log("Error:", error);
      res.status(500).send("Internal server error");
    }
 
}
const getProgress=async(req,res)=>{
        try {
          const username = req.username;
          const course = req.query.course_id;
          console.log(course);
          const user = await Accounts.findOne({
            where: {
              username: username,
            },
          });
          if (user) {
            const progress = await Progress.findOne({
              where: {
                student_id: user.id,
                course_id: course,
              },
            });
            if (progress) {
              res.json(progress);
            }
          }
        } catch (error) {
          console.log("errodr:", error);
        }
    
}
module.exports={progress,getProgress}