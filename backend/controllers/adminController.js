const {
  CourseDetails,
  Student_Purchases,
  Accounts,
  Course_Section,
  Quiz,
  Progress,
  Instructor,
  Institution,
  sendInstitutionMail
} = require("../models/usermodels");

const institution = async (req, res) => {
  try {
    const { username, password, email, address } = req.body;
    const userExists = await Institution.findOne({
      where: {
        institution_name: username,
      },
    });
    if (userExists) {
      return res.status(302).json({
        success: "true",
      });
    } else {
      const newUser = await Institution.create({
        institution_name:username,
        password,
        email,
        address,
      });
      sendInstitutionMail(username, email, password);
      return res.status(201).json({
        success: "true",
        message: "Institution",
      });
    }
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadCSV = async (req, res) => {
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
};

const loginInstitution = async (req, res) => {
  try {
    // console.log(req.body.username);
    const { username, password } = req.body;
    // console.log(username,password);
    const user = await Institution.findOne({
      where: { institution_name: username, password: password },
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
};
const deleteUser = async (req, res) => {
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
};

const deleteInstructor = async (req, res) => {
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
};

const studentInfo = async (req, res) => {
  try {
    const user = req.query.username;

    if (user !== undefined) {
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
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const instructorInfo = async (req, res) => {
  try {
    if (req.query.username) {
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
    }
  } catch (error) {
    console.log("Error45:", error);
  }
};

const icon = async (req, res) => {
  try {
    if (req.query.username) {
      const username = req.query.username;
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
    }
  } catch (error) {
    console.log("1061ERror:", error);
  }
};

const manageStudentCourses = async (req, res) => {
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
};
const manageInstructorCourses = async (req, res) => {
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
};

const pending = async (req, res) => {
  try {
    const username = req.query.username;
    console.log(username);
    const inst = await Institution.findOne({
      where: {
        institution_name: username,
      },
    });
    if (inst) {
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
};
const approve = async (req, res) => {
  try {
    const { courseId } = req.params;

    const approve = await CourseDetails.update(
      {
        approved: true,
      },
      {
        where: {
          id: courseId,
        },
      }
    );
    if (approve) {
      return res.status(200).json({ message: "Success" });
    }
  } catch (error) {
    console.log("1184Error:", error);
  }
};
const getStudentCourses = async (req, res) => {
  try {
    const username = req.query.username;
    const purchases = await Student_Purchases.findAll();
    if (purchases) {
      const courses = await CourseDetails.findAll();
      if (courses) {
      }
    }
    const user = await Institution.findOne({
      where: {
        institution_name: username,
      },
    });
    if (user) {
      const courses = await CourseDetails.findAll({
        where: {
          institution_code: user.id,
        },
      });
      if (courses) {
        const purchase = await Student_Purchases.findAll();
        return res.json(courses);
      }
    }
  } catch (error) {
    console.log("ERROR1278", error);
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const username = req.query.username;
    console.log(username);
    const user = await Institution.findOne({
      where: {
        institution_name: username,
      },
    });
    if (user) {
      const courses = await CourseDetails.findAll({
        where: {
          institution_code: user.id,
        },
      });
      if (courses) {
        return res.json(courses);
      }
    }
  } catch (error) {
    console.log("ERROR1320", error);
  }
};
const data = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await Institution.findOne({
      where: {
        institution_name: username,
      },
    });
    if (user) {
      const purchases = await Student_Purchases.findAll({
        where: {
          institution_code: user.id,
        },
      });
      if (purchases) {
        return res.json(purchases);
      }
    }
  } catch (error) {
    console.log("1329Error", error);
  }
};

module.exports = {
  data,
  manageInstructorCourses,
  manageStudentCourses,
  getInstructorCourses,
  getStudentCourses,
  institution,
  instructorInfo,
  studentInfo,
  uploadCSV,
  pending,
  icon,
  approve,
  loginInstitution,
  deleteInstructor,
  deleteUser
};
