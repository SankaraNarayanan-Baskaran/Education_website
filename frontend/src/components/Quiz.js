import React, { useEffect, useState } from "react";
import { config } from "../App";
import axios from "axios";
import Header from "./Header";
import { enqueueSnackbar } from "notistack";
const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const fetchQuiz = async (course) => {
    try {
      const response = await axios.get(`${config.endpoint}/quiz`, {
        params: {
          course_name: course,
        },
      });
      if (response) {
        setQuiz(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelect = async (question,event) => {
    try {
    //   console.log(event.target.value);
      const response = await axios.get(`${config.endpoint}/answer`, {
        params: {
          question: question,
          option: event.target.value,
        },
      });
      if (response.status ===201) {
        enqueueSnackbar("Correct Answer", { variant: "success" });
      } else {
        enqueueSnackbar("Wrong Answer", { variant: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const course = localStorage.getItem("COURSE");
    fetchQuiz(course);
  }, []);
  return (
    <div>
      <Header isAuthorised={false} prop student></Header>
      {console.log(quiz)}
      <div>
        {quiz.map((question, index) => (
          <div key={question.id}>
            <p>
              {index + 1}.{question.question}
            </p>
            <label>
              <input
                type="radio"
                name="answer"
                value={question.option1}
                onChange={(e) => {
                  
                  handleSelect(question.question, e);
                }}
              />
              {question.option1}
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="answer"
                value={question.option2}
                onChange={(e) => {
                  handleSelect(question.question, e);
                }}
              />
              {question.option2}
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="answer"
                value={question.option3}
                onChange={(e) => {
                  handleSelect(question.question, e);
                }}
              />
              {question.option3}
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="answer"
                value={question.option4}
                onChange={(e) => {
                  handleSelect(question.question, e);
                }}
              />{" "}
              {question.option4}
            </label>
            <br />
            <button id="submit">Submit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
