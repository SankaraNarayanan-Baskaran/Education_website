const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { Accounts, sendWelcomeEmail } = require("../models/usermodels");
router.post("/adduser",userController.adduser);
router.post("/loginuser",userController.loginuser)
module.exports=router