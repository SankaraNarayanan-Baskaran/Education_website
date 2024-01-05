const {
  CourseDetails,
  Student_Purchases,
  Accounts,
  Course_Section,
  Quiz,
  Progress,
  Instructor,
} = require("../models/usermodels");

const addcourse = async (req, res) => {
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
    console.log(inst.institution_code);

    if (inst) {
      console.log("165", inst);
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
};

const fetchcourses = async (req, res) => {
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
};

const learning = async (req, res) => {
  try {
    // console.log("Request:", req.body);
    const param = req.query.username;
    // console.log("Param:", param);
    const some = await Accounts.findOne({ where: { username: param } }).then(
      async (users) => {
        // console.log("Userd:",users);
        const details = await Student_Purchases.findAll({
          where: { student_id: users.id },
        }).then((course) => {
          // console.log("Course:", course);
          res.status(200);
          res.json(course);
        });
      }

      // console.log(details);
      // res.json(details);
    );
  } catch (error) {
    console.log("EEEE", req.query.username);
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const search = async (req, res) => {
  try {
    const results = await CourseDetails.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${req.query.query}%`,
        },
      },
    });
    console.log("Query:", results);
    res.json(results);
  } catch (error) {
    console.log("Error:", error);
  }
};

const filter = async (req, res) => {
  try {
    const category = req.query.category;
    console.log("122",category)
    if (req.query.username) {
      const username = req.query.username;
      const user = await Accounts.findOne({
        where: {
          username: username,
        },
      });

      if (user) {
        if (category === "All") {
          const ans = await CourseDetails.findAll({
            where:{
              institution_code:user.institution_code
            }
          });
          console.log(ans);
          return res.json(ans);
        } else {
          const course = await CourseDetails.findAll({
            where: {
              category: category,
              institution_code:user.institution_code
            },
          });
          if (course) {
           return res.json(course);
          }
        }
      }
      else
      {
        console.log(username,category)
      }
    }
  } catch (error) {
    const category = req.query.category;
    const username=req.query.username;
    console.log(category,username);
  }
};
const courseName=async(req,res)=>{
  try {
    const { courseName } = req.params;
    const course = await Student_Purchases.findAll({
      where: {
        course_name: courseName,
      },
    });
    if (course) {
      return res.json(course);
    }
  } catch (error) {
    console.log("error", error);
  }
}


 


module.exports = { addcourse, fetchcourses, learning, search, filter,courseName };
