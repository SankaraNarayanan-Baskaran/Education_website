const {
  CourseDetails,
  Student_Purchases,
  Accounts,
  Course_Section,
  Quiz,
  Progress,
  Instructor,
} = require("../models/usermodels");
const { Sequelize } = require("sequelize");
const { Op } = require('sequelize');
const progress = async (req, res) => {
  try {
    const { sectionId, count ,username} = req.body;
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
            let completedSections = prog.Completed_Sections || [];

         
            if (!completedSections.includes(sectionId)) {
              completedSections.push(sectionId);
            }

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
            const first = await Progress.create({
              student_id: purchase.student_id,
              course_id: purchase.course_id,
              Completed_Sections: [sectionId],
            });
            if (first) {
              const progress = Math.trunc((100) / count);
              await Progress.update({
                progress: progress,
              },{
                where:{
                  student_id: purchase.student_id,
                  course_id: purchase.course_id,
                }
              }
              );
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
    console.log("Error83:", error);
    res.status(500).send("Internal server error");
  }
};
const getProgress = async (req, res) => {
  try {
    const username = req.query.username;
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
};

const completed=async(req,res)=>{
  try {
    const username=req.query.username;
    const purchase=await Accounts.findOne({
      where:{
       username:username
      }
    });
    if(purchase){
      const comp=await Progress.findAll({
        where:{
          student_id:purchase.id,
          progress:100,
        }
      })
      if(comp){
        const courseIds = comp.map((progress) => progress.course_id);
        const studentIds=comp.map((ids) => ids.student_id)
        const finished=await Student_Purchases.findAll({
          where:{
            student_id:studentIds,
            course_id:courseIds
          }
        })
        return res.json({
          courseDetails: finished,
          courseProgress: comp,
        });
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const ongoing=async(req,res)=>{
  try {
    const username=req.query.username;
    const purchase=await Accounts.findOne({
      where:{
       username:username
      }
    });
    if(purchase){
      const comp=await Progress.findAll({
        where:{
          student_id:purchase.id,
          progress:{[Op.ne]: 100},
        }
      })
      if(comp){
        const courseIds = comp.map((progress) => progress.course_id);
        const studentIds=comp.map((ids) => ids.student_id)
        const finished=await Student_Purchases.findAll({
          where:{
            student_id:studentIds,
            course_id:courseIds
          }
        })
        return res.json({
          courseDetails: finished,
          currentProgress: comp,
        });
      }
    }
  } catch (error) {
    console.log(error)
  }
}
module.exports = { progress, getProgress,completed ,ongoing};
