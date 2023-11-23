const { Instructor } = require("../models/usermodels");
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



const logininst=async(req,res)=>{
   
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
      
}
module.exports={adduser,logininst}