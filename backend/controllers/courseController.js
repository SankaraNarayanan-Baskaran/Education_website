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
const addcourse = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      username,
      video_url,
      course_id,
      category,
      approved,
    } = req.body;
   
    console.log("Instructor name:",username);
 
      
      const inst = await Instructor.findOne({ where: { name: username } });
      if (inst) {
        console.log("165", inst);
      const course= await CourseDetails.create({
          name,
          description,
          price,
          video_url,
          user_id: inst.id,
          category,
          approved,
          institution_code: inst.institution_code,
        });
        if(course){
          return res.status(201).json({ message: "Course created successfully" })
        }
        
      
    }
    

    
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
    // console.log("Cookie:", req.cookies);
    // const myCookieValue = req.cookies.jwtToken;
    // console.log('Value of jwtToken:', myCookieValue);
    const param = req.username;
    console.log("Learner name", param);
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
    const query = req.query.query || "";
    const username=req.username;
    // Check if the query is empty
    if (query.trim() === "") {
      const allResults = await CourseDetails.findAll();
      console.log("All Results:", allResults);
      res.json(allResults);
    } else {
      // Perform the search if the query is not empty
      if(username){
        const user=await Accounts.findOne({where:{
          username:username
        }})
        const results = await CourseDetails.findAll({
          where: {
            name: {
              [Sequelize.Op.iLike]: `%${query}%`,
            },
            institution_code:user.institution_code
            
          },
        });
      
        res.json(results);
      }
      else{
        const results = await CourseDetails.findAll({
          where: {
            name: {
              [Sequelize.Op.iLike]: `%${query}%`,
            },
            institution_code:null
            
          },
        });
        res.json(results);
      }
     
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const filter = async (req, res) => {
  try {
    const category = req.query.category;
    if (req.username) {
      const username = req.username;
      const user = await Accounts.findOne({
        where: {
          username: username,
        },
      });

      if (user) {
        if (category === "All") {
          const ans = await CourseDetails.findAll({
            where: {
              institution_code: user.institution_code,
            },
          });
          console.log(ans);
          return res.json(ans);
        } else {
          const course = await CourseDetails.findAll({
            where: {
              category: category,
              institution_code: user.institution_code,
            },
          });
          if (course) {
            return res.json(course);
          }
        }
      } else {
        console.log(username, category);
      }
    }
    else{
      if (category === "All") {
        const ans = await CourseDetails.findAll({
          where: {
            institution_code: null
          },
        });
        console.log(ans);
        return res.json(ans);
      } else {
        const course = await CourseDetails.findAll({
          where: {
            category: category,
            institution_code: null
          },
        });
        if (course) {
          return res.json(course);
        }
      }
    }
  } catch (error) {
    const category = req.query.category;
   
    console.log(category);
  }
};
const courseName = async (req, res) => {
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
};

module.exports = {
  addcourse,
  fetchcourses,
  learning,
  search,
  filter,
  courseName,
};
