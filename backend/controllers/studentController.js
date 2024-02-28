
const {
  Accounts,
  sendWelcomeEmail,
  CourseDetails,
  Student_Purchases,
  Instructor,
  Institution,
} = require("../models/usermodels");
const jwtUtils = require("../utils/jwtUtils");
const cookieParser = require('cookie-parser');
const adduser = async (req, res, next) => {
  try {
    const { username, password, email, address } = req.body;
    const userExists = await Accounts.findOne({
      where: {
        username: username,
      },
    });
    if (userExists) {
      return res.status(302).json({
        success: "true",
      });
    } else {
      const newUser = await Accounts.create({
        username,
        password,
        email,
        address,
      });
      return res.status(201).json({
        success: "true",
        message: "Google account",
      });
    }
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ error: "Internal server error" });
    next(error);
  }
};

const loginuser = async (req, res) => {
  try {
    // console.log(req.body.username);
    const { username, password } = req.body;
    // console.log(username,password);
    const user = await Accounts.findOne({
      where: { username: username, password: password },
    });
    if (user) {
      const inst=await Instructor.findOne({
        where:{
          name:username
        }
      })
      if(inst){
        const token=jwtUtils.generateToken(user.email,username,['student','instructor'])
        // cookies.set('jwtToken', token, {
        //   httpOnly: true, // Ensures the cookie is only accessible by the server
        //   secure: true,   // Ensures the cookie is sent only over HTTPS in a production environment
        // });
        res.cookie('jwtToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        console.log("cki:",res)
        return res.status(201).json({
          success: true,
          data: token, // Assuming res.data contains the data you want to return
        });
      }
      else{
        const token = jwtUtils.generateToken(user.email,username,['student']);
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

const google = async (req, res) => {
  try {
    const { username, password, email, address } = req.body;
    sendWelcomeEmail(username, email, password);
   
    const userExists = await Accounts.findOne({
      where: {
        username: username,
      },
    });

    if (userExists) {
      const token = jwtUtils.generateToken(userExists.email,username,['student']);
      return res.status(201).json({
        success: true,
        data: token, // Assuming res.data contains the data you want to return
      });
    } else {
      const newUser = await Accounts.create({
        username,
        password,
        email,
        address,
      });
      const token = jwtUtils.generateToken(newUser.email,username,['student']);
      return res.status(201).json({
        success: true,
        data: token, // Assuming res.data contains the data you want to return
      });
    }
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const studentview = async (req, res) => {
  try {
    if (req.username) {
      const name = req.username;

      const user = await Accounts.findOne({
        where: {
          username: name,
        },
      });
      if (user) {
        const courses = await CourseDetails.findAll({
          where: {
            institution_code: user.institution_code,
            approved: true,
          },
        });
        if (courses) {
          console.log("294C", courses);

          return res.json(courses);
        }
      }
    } else {
      
    }
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const publicview=async(req,res)=>{
  try {
    const details = await CourseDetails.findAll({
      where: {
        institution_code: null,
      },
    });
    return res.json(details);
  } catch (error) {
    console.log("Error",error)
  }
}
const learners = async (req, res) => {
  try {
    const course_id = req.query.course_id;
    const username = req.username;
    console.log("course_id:", course_id);

    // Find the account based on the username (replace with dynamic username retrieval)
    const enrolled = await Student_Purchases.findAll({
      where: { course_id: course_id },
    });

    if (!enrolled) {
      return res.json(0);
    }

    enrolled.map((enrollment) => {
      console.log(enrollment.student_name);
    });
    return res.json(enrolled);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const isStudent = async (req, res) => {
  try {
    if (req.username) {
      const name = req.username;
      const user = await Accounts.findOne({
        where: {
          username: name,
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

const convertToStudent = async (req, res) => {
  try {
    const name = req.username;
    const user = await Accounts.findOne({ where: { username: name } });
    if (user) {
      return res.status(299).json("Already a student");
    }
    const inst = await Instructor.findOne({ where: { name: name } });
    if (inst) {
      const student = await Accounts.create({
        username: name,
        password: inst.password,
        email: inst.mail,
      });
      return res.status(201).json("Student");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if(oldPassword){
      await Accounts.update(
        {password: newPassword,},
        {where: {password: oldPassword,},}
      ),
      await Instructor.update(
        {password: newPassword,},
        {where: {password: oldPassword,},}
      ),
      await Institution.update(
        {password: newPassword,},
        {where: {password: oldPassword,},}
      )
    }
    
      res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log("Error", error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if(username){
      await Accounts.update(
        {password: newPassword,},
        {
          where: {username: username,},
        },),
      await Instructor.update(
          {password: newPassword,},
          {
            where: {name: username,},
          },),
      await Institution.update(
            {password: newPassword,},
            {
              where: {institution_name: username,},
            },)
    }
    
      
      res.status(201).json({ message: "Success" });
    
  } catch (error) {
    console.log("Error", error);
  }
};

module.exports = {
  adduser,
  loginuser,
  google,
  studentview,
  publicview,
  learners,
  isStudent,
  convertToStudent,
  updatePassword,
  forgotPassword,
};
