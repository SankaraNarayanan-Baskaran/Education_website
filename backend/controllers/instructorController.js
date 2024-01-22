const {
  Instructor,
  CourseDetails,
  Accounts,
  Course_Section,
  Student_Purchases,
} = require("../models/usermodels");
const jwtUtils = require("../utils/jwtUtils");
const adduser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const userExists = await Instructor.findOne({
      where: {
        name: username,
      },
    });
    if (userExists) {
      return res.status(302).json({
        success: "true",
      });
    } else {
      const newUser = await Instructor.create({
        name: username,
        password,
        mail: email,
      });
      return res.status(201).json({
        success: "true",
        message: "Google account",
      });
    }
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logininst = async (req, res) => {
  try {
    // console.log(req.body.username);
    const { username, password } = req.body;
    // console.log(username,password);
    const user = await Instructor.findOne({
      where: { name: username, password: password },
    });
    if (user) {
      const stud=await Accounts.findOne({
        where:{
          username:user.name
        }
      })
      if(stud){
        const token = jwtUtils.generateToken(user.mail, username,['instructor','student']);
        return res.status(201).json({
          success: true,
          data: token, // Assuming res.data contains the data you want to return
        });
      }
      else{
        const token = jwtUtils.generateToken(user.mail, username,['instructor']);
        console.log("Generated Token:", token);
  
        return res.status(201).json({
          success: true,
          data: token, // Assuming res.data contains the data you want to return
        });
      }
     
    } else
      return res.status(500).json({
        success: "false",
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const instructorview = async (req, res) => {
  try {
    if (req.query.username) {
      const name = req.query.username;

      const user = await Instructor.findOne({
        where: {
          name: name,
        },
      });
      if (user) {
        const courses = await CourseDetails.findAll({
          where: {
            user_id: user.id,
            institution_code: user.institution_code,
            approved: true,
          },
        });
        if (courses) {
          console.log("247C", courses);

          return res.json(courses);
        }
      }
    } else {
      const details = await CourseDetails.findAll({
        where: {
          institution_code: null,
        },
      });
      return res.json(details);
    }
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const isInstructor = async (req, res) => {
  try {
    if (req.query.name) {
      const name = req.query.name;
      const user = await Instructor.findOne({
        where: {
          name: name,
        },
      });
      if (user) {
        console.log(user);
        return res.status(201).json({ message: "Success" });
      } else {
        return res.status(202).json({ message: "success" });
      }
    }
  } catch (error) {
    console.log("ERRORRR:", error);
  }
};
const convertToInstructor = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    const user = await Instructor.findOne({ where: { name: name } });
    if (user) {
      return res.status(299).json("Already an Instructor");
    }
    const inst = await Accounts.findOne({ where: { username: name } });
    if (inst) {
      const student = await Instructor.create({
        name: name,
        password: inst.password,
        mail: inst.email,
      });
      return res.status(201).json("Instructor");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
module.exports = {
  adduser,
  logininst,
  instructorview,
  isInstructor,
  convertToInstructor,
};
