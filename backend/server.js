const express = require("express");
const nodemailer=require("nodemailer")
const cors = require("cors");
const pool = require("./config/database");
const PORT = 3001;
const bodyParser = require("body-parser");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");
const coursedetails = require("./models/coursedetails");

app.use(bodyParser.json());
// app.use(express.json());
app.use(cors());
const sequelize = new Sequelize({
  dialect: "postgres",
  ...require("./config/config.json")["development"],
});
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: "sankaran879@gmail.com",
    pass: "nvix fmvk ekfz sboa",
  },
});


const sendWelcomeEmail = (username, email, generatedPassword) => {
  const mailOptions = {
    from: "YourEmailAddress",
    to: email,
    subject: "Welcome to Your App",
    text: `Hello ${username},\n\nWelcome to Your App! Your username is: ${username}\nYour password is: ${generatedPassword}\n\nPlease change your password after logging in for security.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const CourseDetails = sequelize.define("CourseDetails", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL(10, 2),
  video_url: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
});

const Accounts = sequelize.define("Accounts", {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.TEXT,
});

const Student_Purchases = sequelize.define("Student_Purchases", {
  course_name: DataTypes.STRING,
  course_description: DataTypes.TEXT,
  video_url: DataTypes.STRING,
  student_id: DataTypes.INTEGER,
  student_name: DataTypes.STRING,
  course_id: DataTypes.INTEGER,
  Progress:DataTypes.INTEGER
});

const Course_Section=sequelize.define("Course_Section",{
  section_name:DataTypes.STRING,
  section_description:DataTypes.TEXT,
  img_url:DataTypes.STRING,
  Course_id:DataTypes.INTEGER,
  Course_name:DataTypes.STRING
})

sequelize.sync();
app.post("/api/adduser", async (req, res) => {
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
  }
});
app.post("/api/loginuser", async (req, res) => {
  try {
    // console.log(req.body.username);
    const { username, password } = req.body;
    // console.log(username,password);
    const user = await Accounts.findOne({
      where: { username: username, password: password },
    });
    if (user) {
      return res.status(201).json({
        success: "true",
      });
    } else
      return res.status(500).json({
        success: "false",
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/google", async (req, res) => {
  try {
    
    const { username, password, email, address } = req.body;
    sendWelcomeEmail(username, email,password);
    const userExists = await Accounts.findOne({
      where: {
        username: username,
      },
    });
    if (userExists) {
      return res.status(201).json({
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
      });
    }
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/courses", async (req, res) => {
  try {
    const { name, description, price, video_url, username, course_id } =
      req.body;
    console.log("Username:", username);

    Accounts.findOne({ where: { username: username } }).then((user) => {
      // Create an order associated with the user
      console.log("UserID:", user.id);

      CourseDetails.create({
        name,
        description,
        price,
        video_url,
        user_id: user.id,
      });
      // console.log(userId);
    });

    // res = newCourse;
  } catch (error) {
    console.error("Error creating a CourseDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    
    const param = req.query.username;
    // console.log("Param:", param);
    const some = await Accounts.findOne({ where: { username: param } }).then(
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
    console.log(req.query.username);
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/student", async (req, res) => {
  try {
    const details = await CourseDetails.findAll();
    return res.json(details);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/learning", async (req, res) => {
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
    console.log(req.query.username);
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/learning", async (req, res) => {
  try {
    const { course_name, course_description, video_url, student_name } = req.body;
    
    // First, find the user based on their username
    const user = await Accounts.findOne({ where: { username: student_name } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Next, find the course based on its name
    const course = await CourseDetails.findOne({ where: { name: course_name } });

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
      student_name,
      course_id: course.id,
    });

    // Return a success response
    return res.status(201).json({ message: "Course purchased successfully" });
  } catch (error) {
    console.error("Error creating a CourseDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/learners", async (req, res) => {
  try {
    const course_id = req.query.course_id;
    const username=req.query.username
    console.log("course_id:", course_id);

    // Find the account based on the username (replace with dynamic username retrieval)
    const user = await Accounts.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User:", user.id);

    // Find all student purchases for the user
    const userPurchases = await Student_Purchases.findAndCountAll({
      where: { student_id: user.id },
    });

    // Find student purchases for the specific course_id
    const specificCoursePurchases = await Student_Purchases.findAll({
      where: { course_id },
    });

    console.log("Purchase:", specificCoursePurchases);

    // Send the specific course purchases as a JSON response
    return res.json(specificCoursePurchases);
  
}
 catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/section", async (req, res) => {
  try {
    const { section_name, section_description, img_url,course_name,username} =
      req.body;
    Accounts.findOne({ where: { username: username } }).then(async (user) => {
      await CourseDetails.findOne({ where: { name: course_name } }).then(async (course) => {
        await Course_Section.create({
          section_name,
          section_description,
          img_url,
          Course_id:course.id,
          Course_name:course_name
        });
      });

      // console.log(userId);
    });

    // res = newCourse;
  } catch (error) {
    console.error("Error creating a CourseDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/purchased", async (req, res) => {
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
});



app.get("/api/section", async (req, res) => {
  try {
    // console.log("Request:", req.body);
    const param = req.query.course_id;
    console.log("Param:", param);
    const some = Student_Purchases.findOne({ where: {course_id:param } }).then(
      async (course) => {
        console.log("CourseID:",course.id);
         await Course_Section.findAll({
          where:{Course_id:course.course_id}
         }).then((section) => {
         console.log("Section:",section)
          res.json(section);
        });
      }

      // console.log(details);
      // res.json(details);
    );
  } catch (error) {
    console.log(req.query.username);
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/search",async(req,res)=>{
  try {
   
    const results = await CourseDetails.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${req.query.query}%`, 
        },
      },
    });
    console.log("Query:",results)
    res.json(results); 
  }  catch (error) {
    console.log("Error:",error);
  }
})

app.put("/api/updatePass",async(req,res)=>{
  try {
    const {oldPassword,newPassword}=req.body;
    await Accounts.update({
      password:newPassword
    },
    {
      where:{
        password:oldPassword
      }
    }).then(()=>{
      res.status(201).json({message:"Success"})
    })
  } catch (error) {
    console.log("Error",error);
  }
})

app.put("/api/progress",async(req,res)=>{
  try {
    const {newProgress}=req.body;
    await Student_Purchases.update({
      Progress:newProgress
    },{
      where:{
        course_name:"samp"
      }
    })
  } catch (error) {
    console.log("Error:",error);
  }
})
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const course = await CourseDetails.findByPk(id);
    await course.destroy();
  } catch (error) {
    console.error("Error Deleting Course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
