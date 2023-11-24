const { Quiz } = require("../models/usermodels");

const quiz = async (req, res) => {
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
};

const getQuiz = async (req, res) => {
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
};
const answer = async (req, res) => {
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
};

module.exports = { quiz, getQuiz, answer };
