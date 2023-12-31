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

sequelize.sync();

const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes=require("./routes/instructorRoutes");
const courseRoutes=require("./routes/courseRoutes");
const adminRoutes=require("./routes/adminRoutes")

app.use("/api/student", studentRoutes);
app.use("/api/inst",instructorRoutes);
app.use("/api/course",courseRoutes);
app.use("/api/admin",adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
