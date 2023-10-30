import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../App";
import Header from "./Header";
import "./StudentList.css";
const StudentsList = () => {
  const [list, setList] = useState([]); // Initialize list as an array
  const [newQuestion, setNewQuestion] = useState({});
  const [quizData, setQuizData] = useState({
    title: '',
    questions: [],
  });

  const handleAddQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          text: '',
          options: ['', '', '', ''], 
          correctAnswer: '',
        },
      ],
    });
  };

  const handleAddOption = (questionIndex) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.map((q, index) =>
        index === questionIndex
          ? {
              ...q,
              options: [...q.options, ''], 
            }
          : q
      ),
    });
  };

  const handleSubmit=async()=>{
    try {
      await axios.post(`${config.endpoint}/quiz`,quizData)
    } catch (error) {
      console.log(error)
    }
  }
  const studentList = async (courseName) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/${courseName}/students`,
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
    const crs = localStorage.getItem("courseName");
    studentList(crs);
  }, []);

  return (
    <div>
      <Header isAuthorised={false} prop student instr />
      {list.map((student, index) => (
        <li key={index}>{student}</li>
      ))}

      <>
        <div class="quiz-container">
          <center>
          <div className='body'>
      <h2>Create Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={quizData.title}
        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
      />
      <div className='question'>
      {quizData.questions.map((question, questionIndex) => (
        <div key={questionIndex}>
          <input
            type="text"
            placeholder={`Question ${questionIndex + 1}`}
            value={question.text}
            onChange={(e) =>
              setQuizData({
                ...quizData,
                questions: quizData.questions.map((q, index) =>
                  index === questionIndex ? { ...q, text: e.target.value } : q
                ),
              })
            }
          />
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <input
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    questions: quizData.questions.map((q, qIndex) =>
                      qIndex === questionIndex
                        ? {
                            ...q,
                            options: q.options.map((o, oIndex) =>
                              oIndex === optionIndex
                                ? e.target.value
                                : o
                            ),
                          }
                        : q
                    ),
                  })
                }
              />
            </div>
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={question.correctAnswer}
            onChange={(e) =>
              setQuizData({
                ...quizData,
                questions: quizData.questions.map((q, index) =>
                  index === questionIndex
                    ? { ...q, correctAnswer: e.target.value }
                    : q
                ),
              })
            }
          />
          <div className='addoption'>
          <button onClick={() => handleAddOption(questionIndex)}>Add Option</button>
          </div>
          
        </div>
      ))}
      </div>
      <button onClick={handleAddQuestion}>Add Question</button>
      <button onClick={()=>{
        handleSubmit()
      }}>Create Quiz</button>
    </div>
          </center>
        </div>
      </>
    </div>
  );
};

export default StudentsList;
