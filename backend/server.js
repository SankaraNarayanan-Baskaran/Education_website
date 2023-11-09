const express = require("express");
const fastcsv = require("fast-csv");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const pool = require("./config/database");
const PORT = 3001;
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");
const coursedetails = require("./models/coursedetails");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(bodyParser.json());
// app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

const sendInstitutionMail = (username, email, generatedPassword) => {
  const mailOptions = {
    from: "YourEmailAddress",
    to: email,
    subject: "Welcome to EduWeb",
    text: `Greetings ${username},\n\nYour Institution has been successfully registered\nExplore our services\n\nStart Adding Instructors and Students.`,
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
  category: DataTypes.TEXT,
  approved: DataTypes.BOOLEAN,
  institution_code: DataTypes.INTEGER,
});

const Accounts = sequelize.define("Accounts", {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.TEXT,
  institution_code: DataTypes.INTEGER,
});

const Student_Purchases = sequelize.define("Student_Purchases", {
  course_name: DataTypes.STRING,
  course_description: DataTypes.TEXT,
  video_url: DataTypes.STRING,
  student_id: DataTypes.INTEGER,
  student_name: DataTypes.STRING,
  course_id: DataTypes.INTEGER,
  Progress: DataTypes.INTEGER,
});

const Course_Section = sequelize.define("Course_Section", {
  section_name: DataTypes.STRING,
  section_description: DataTypes.TEXT,
  img_url: DataTypes.STRING,
  Course_id: DataTypes.INTEGER,
  Course_name: DataTypes.STRING,
  transcript: DataTypes.TEXT,
});

const Progress = sequelize.define("Progress", {
  student_id: DataTypes.INTEGER,
  course_id: DataTypes.INTEGER,
  progress: DataTypes.INTEGER,
  Completed_Sections: DataTypes.ARRAY(DataTypes.INTEGER),
  Completed_Count: DataTypes.INTEGER,
});

const Instructor = sequelize.define("Instructor", {
  name: DataTypes.STRING,
  password: DataTypes.STRING,
  mail: DataTypes.STRING,
  institution_code:DataTypes.INTEGER
});

const Quiz = sequelize.define("Quiz", {
  question: DataTypes.TEXT,
  option1: DataTypes.STRING,
  option2: DataTypes.STRING,
  option3: DataTypes.STRING,
  option4: DataTypes.STRING,
  correct_answer: DataTypes.STRING,
  title: DataTypes.STRING,
  course_name: DataTypes.STRING,
});

const Institution = sequelize.define("Institution", {
  institution_name: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.TEXT,
  icon: DataTypes.STRING,
});
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

app.post("/api/inst", async (req, res) => {
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

app.post("/api/logininst", async (req, res) => {
  try {
    // console.log(req.body.username);
    const { username, password } = req.body;
    // console.log(username,password);
    const user = await Instructor.findOne({
      where: { name: username, password: password },
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
    sendWelcomeEmail(username, email, password);
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
});

app.get("/api/courses", async (req, res) => {
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
});

app.get("/api/student", async (req, res) => {
  try {
    const details = await CourseDetails.findAll({
      where:{
        approved:true
      }
    });
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
    console.log("EEEE", req.query.username);
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/learning", async (req, res) => {
  try {
    const { course_name, course_description, video_url, student_name } =
      req.body;

    // First, find the user based on their username
    const user = await Accounts.findOne({ where: { username: student_name } });

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
    const username = req.query.username;
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
});

app.post("/api/section", async (req, res) => {
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
    const some = Student_Purchases.findOne({
      where: { course_id: param },
    }).then(
      async (course) => {
        console.log("CourseID:", course.id);
        await Course_Section.findAll({
          where: { Course_id: course.course_id },
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
});

app.get("/api/search", async (req, res) => {
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
});

app.put("/api/updatePass", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await Accounts.update(
      {
        password: newPassword,
      },
      {
        where: {
          password: oldPassword,
        },
      }
    ).then(() => {
      res.status(201).json({ message: "Success" });
    });
  } catch (error) {
    console.log("Error", error);
  }
});

app.put("/api/forgotPass", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    await Accounts.update(
      {
        password: newPassword,
      },
      {
        where: {
          username: username,
        },
      }
    ).then(() => {
      res.status(201).json({ message: "Success" });
    });
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/api/progress", async (req, res) => {
  try {
    const { sectionId, username, count } = req.body;
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
});

app.post("/api/updateSection", async (req, res) => {
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
});

app.get("/api/getProgress", async (req, res) => {
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
});

app.post("/api/convert", async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
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
});

app.get("/api/filter", async (req, res) => {
  try {
    const category = req.query.category;
    console.log(category);
    if (category === "All") {
      const ans = await CourseDetails.findAll();
      console.log(ans);
      return res.json(ans);
    } else {
      const course = await CourseDetails.findAll({
        where: {
          category: category,
        },
      });
      if (course) {
        res.json(course);
      }
    }
  } catch (error) {
    console.log("error:", error);
  }
});

app.get("/api/:courseName/students", async (req, res) => {
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
});

app.get("/api/instructor", async (req, res) => {
  const name = req.query.name;
  try {
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
  } catch (error) {
    console.log("ERRORRR:", error);
  }
});

app.get("/api/isStudent", async (req, res) => {
  const name = req.query.name;
  try {
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
  } catch (error) {
    console.log("ERRORRR:", error);
  }
});

app.post("/api/convertInst", async (req, res) => {
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
});
app.post("/api/quiz", async (req, res) => {
  try {
    const {
      question,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      course_name,
    } = req.body;
    await Quiz.create({
      question,
      option1,
      option2,
      option3,
      option4,
      correct_answer: correctAnswer,
      course_name,
    });
  } catch (error) {
    console.log("Error", error);
  }
});

app.get("/api/quiz", async (req, res) => {
  try {
    const courseName = req.query.course_name;
    console.log(courseName);
    const questions = await Quiz.findAll({
      where: {
        course_name: courseName,
      },
    });
    if (questions) {
      console.log("QUIZ:", questions);
      return res.json(questions);
    }
  } catch (error) {
    console.log("Error", error);
  }
});

app.get("/api/answer", async (req, res) => {
  try {
    const question = req.query.question;
    const option = req.query.option;
    const ques = await Quiz.findOne({
      where: {
        question: question,
      },
    });
    if (ques) {
      if (ques.correct_answer === option) {
        return res.status(201).json({ message: "Success" });
      } else {
        return res.status(202).json({ message: "Failure" });
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/api/institution", async (req, res) => {
  try {
    const { institution_name, password, email, address } = req.body;
    const userExists = await Institution.findOne({
      where: {
        institution_name: institution_name,
      },
    });
    if (userExists) {
      return res.status(302).json({
        success: "true",
      });
    } else {
      const newUser = await Institution.create({
        institution_name,
        password,
        email,
        address,
      });
      sendInstitutionMail(institution_name, email, password);
      return res.status(201).json({
        success: "true",
        message: "Institution",
      });
    }
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/upload-csv", upload.single("csvFile"), (req, res) => {
  const fileBuffer = req.file.buffer.toString("utf8");

  const results = [];
  fastcsv
    .parseString(fileBuffer, { headers: true })
    .on("data", (row) => results.push(row))
    .on("end", () => {
      sequelize
        .sync()
        .then(() => {
          return Accounts.bulkCreate(results);
        })
        .then(() => {
          res.status(200).send("Data inserted successfully.");
        })
        .catch((err) => {
          console.error("Error inserting data:", err);
          res.status(500).send("Error inserting data.");
        });
    });
});

app.post("/api/logininstitution", async (req, res) => {
  try {
    // console.log(req.body.username);
    const { institution_name, password } = req.body;
    // console.log(username,password);
    const user = await Institution.findOne({
      where: { institution_name: institution_name, password: password },
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
app.delete("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await Accounts.findByPk(id);
    await user.destroy();
    return res.json(id);
  } catch (error) {
    console.error("Error Deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/instructor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const instructor = await Instructor.findByPk(id);
    await instructor.destroy();
    return res.json(id);
  } catch (error) {
    console.error("Error Deleting Instructor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/studentinfo", async (req, res) => {
  try {
    const user = req.query.username;
    const students = await Institution.findOne({
      where: {
        institution_name: user,
      },
    });
    console.log(students);
    if (students) {
      const accounts = await Accounts.findAll({
        where: {
          institution_code: students.id,
        },
      });
      if (accounts) {
        return res.json(accounts);
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

app.get("/api/instructorinfo", async (req, res) => {
  try {
    const user = req.query.username;
    const students = await Institution.findOne({
      where: {
        institution_name: user,
      },
    });
    console.log("1033:", students);
    if (students) {
      const accounts = await Instructor.findAll({
        where: {
          institution_code: students.id,
        },
      });
      if (accounts) {
        return res.json(accounts);
      }
    }
  } catch (error) {
    console.log("Error45:", error);
  }
});

app.get("/api/icon", async (req, res) => {
  try {
    const username = req.query.username;
    console.log("1052:", username);
    const user = await Accounts.findOne({
      where: {
        username: username,
      },
    });

    const inst = await Instructor.findOne({
      where: {
        name: username,
      },
    });
    console.log("INS", inst);
    if (user) {
      console.log(user);
      const icon = await Institution.findOne({
        where: {
          id: user.institution_code,
        },
      });
      if (icon) {
        console.log(icon);
        return res.json(icon);
      }
    } else if (inst) {
      const icon = await Institution.findOne({
        where: {
          id: inst.institution_code,
        },
      });
      if (icon) {
        return res.json(icon);
      }
    } else {
    }
  } catch (error) {
    console.log("1061ERror:", error);
  }
});

app.get("/api/managecourses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Accounts.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      const courses = await Student_Purchases.findAll({
        where: {
          student_id: id,
        },
      });
      if (courses) {
        // console.log(courses)
        return res.json(courses);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/manageinstcourses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Instructor.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      const courses = await CourseDetails.findAll({
        where: {
          user_id: id,
        },
      });
      if (courses) {
        // console.log(courses)
        return res.json(courses);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/pending", async (req, res) => {
  try {
    const username = req.query.username;
    console.log(username);
    const inst = await Institution.findOne({
      where: {
        institution_name: username,
      },
    });
    if (inst) {
      console.log(inst);
      if (inst.id) {
        const pending = await CourseDetails.findAll({
          where: {
            institution_code: inst.id,
            approved: false,
          },
        });
        if (pending) {
          console.log(pending);
          return res.json(pending);
        }
      } else {
        console.log("Institution code is undefined");
        return res.json([]); // Return an empty array or handle this case appropriately
      }
    }
  } catch (error) {
    console.log("ERROR:", error);
    // Handle the error appropriately (e.g., return an error response)
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/api/courses/:courseId/approve", async (req, res) => {
  try {
    const { courseId } = req.params;
   
     const approve= await CourseDetails.update(
        {
         approved:true,
        },
        {
          where: {
            id:courseId,
          },
        })
    if(approve){
      return res.status(200).json({message:"Success"})
    }
  } catch (error) {
    console.log("1184Error:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
