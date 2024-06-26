import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../App";
import Header from "../Header";
import "./styles/StudentList.css";
import { useCookies } from "react-cookie";
const StudentsList = () => {
  const [list, setList] = useState([]); // Initialize list as an array
  const [newQuestion, setNewQuestion] = useState({});
  const [cookies]=useCookies(['username','courseName'])
  const course=cookies["courseName"];
  const [quizData, setQuizData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
    course_name:course
  });
  

  const handleAddQuestion = async () => {
    try {
      await axios.post(`${config.endpoint}/course/quiz`,quizData);
      setQuizData({
        question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
      })
    } catch (error) {
      console.log(error)
    }
  };

  

  
  const studentList = async (courseName) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/course/${courseName}/students`,
        {
          params: {
            courseName: courseName,
          },
        }
      );

      if (response) {
        const studentNames = response.data.map((course) => course.student_name);
        setList(studentNames);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const crs = cookies['courseName']
    studentList(crs);
  }, []);

  return (
    <div>
      <Header isAuthorised={false} prop student instr />
      <h4>Student List</h4>
      {list.map((student, index) => (
        <li key={index}>{student}</li>
      ))}

      <>
        <div>
          <center>
            <div className="body">
              {/* <h2>Create Quiz</h2>
             
              <input
                type="text"
                placeholder="Question"
                value={quizData.question}
                onChange={(e) =>
                  setQuizData({ ...quizData, question: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Option 1"
                value={quizData.option1}
                onChange={(e) =>
                  setQuizData({ ...quizData, option1: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Option 2"
                value={quizData.option2}
                onChange={(e) =>
                  setQuizData({ ...quizData, option2: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Option 3"
                value={quizData.option3}
                onChange={(e) =>
                  setQuizData({ ...quizData, option3: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Option 4"
                value={quizData.option4}
                onChange={(e) =>
                  setQuizData({ ...quizData, option4: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Correct Answer"
                value={quizData.correctAnswer}
                onChange={(e) =>
                  setQuizData({ ...quizData,correctAnswer: e.target.value })
                }
              />
             <div style={{
              marginTop:"10px"
             }}> <button onClick={handleAddQuestion}>Add Question</button></div> */}
            </div>
          </center>
        </div>
      </>
    </div>
  );
};

export default StudentsList;
