const nodemailer = require("nodemailer");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "postgres",
  ...require("../config/config.json")["development"],
});

const Accounts = sequelize.define("Accounts", {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.TEXT,
  institution_code: DataTypes.INTEGER,
});
const Instructor = sequelize.define("Instructor", {
  name: DataTypes.STRING,
  password: DataTypes.STRING,
  mail: DataTypes.STRING,
  institution_code: DataTypes.INTEGER,
});
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
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sankaran879@gmail.com",
    pass: "aikb rktp ozlf abyy",
  },
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

const sendWelcomeEmail = (username, email, generatedPassword) => {
  const mailOptions = {
    from: "YourEmailAddress",
    to: email,
    subject: "Welcome to EduWeb",
    text: `Hello ${username},\n\nWelcome to EduWeb! Your username is: ${username}\nYour password is: ${generatedPassword}\n\nPlease change your password after logging in for security.`,
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

module.exports = {
  Accounts,
  Instructor,
  CourseDetails,
  Course_Section,
  Progress,
  Student_Purchases,
  Quiz,
  sendWelcomeEmail,
  sendInstitutionMail,
  Institution,
};
