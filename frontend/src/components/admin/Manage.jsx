import React, { useEffect, useState } from "react";
import { config } from "../../App";
import Header from "../Header";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Manage = () => {
  const [completed, setCompleted] = useState([]);
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies([
    "username",
    "studentname",
    "icon",
    "role",
    "mang",
  ]);
  const student = cookies["mang"];
  const [ongoing, setOngoing] = useState([]);
  const [inst, setInst] = useState([]);
  const [prog, setProg] = useState([]);
  const [current, setCurrent] = useState([]);
  const [students, setStudents] = useState([]);
  const kind = localStorage.getItem("kind");
  const fetchCompleted = async (username) => {
    try {
      const res = await axios.get(`${config.endpoint}/admin/completed`, {
        params: {
          username: username,
        },
      });
      if (res) {
        const { courseDetails, courseProgress } = res.data;
        setCompleted(courseDetails);
        setProg(courseProgress);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchOngoing = async (username) => {
    try {
      const resp = await axios.get(`${config.endpoint}/admin/ongoing`, {
        params: {
          username: username,
        },
      });
      if (resp) {
        const { courseDetails, currentProgress } = resp.data;
        console.log(ongoing);
        setOngoing(courseDetails);
        setCurrent(currentProgress);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchInstructor = async (username) => {
    try {
      const resp = await axios.get(`${config.endpoint}/admin/fetchinst`, {
        params: {
          username: username,
        },
      });
      if (resp) {
        const { courseDetails, purchased } = resp.data;
        setInst(courseDetails);
        setStudents(purchased);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const convertToDate = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toISOString().split("T")[0]; // Extract date part only
    return dateString;
  };
  const extractTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const amPM = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    const timeString = `${hours}:${minutes}:${seconds} ${amPM}`;
    return timeString;
  };

  useEffect(() => {
    const username = localStorage.getItem("studentname");

    fetchCompleted(username);
    fetchOngoing(username);
    fetchInstructor(username);
  }, []);
  return (
    <div>
      <>
        <>
          <Header isAuthorised={false} prop student admin>
            <button
              onClick={() => {
                navigate("/admin");
              }}
            >
              Back to Home
            </button>
          </Header>
        </>
        {kind === "student" ? (
          <>
            <h3>Completed Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course Description</th>
                  <th>Started on</th>
                  <th>Completed on</th>
                </tr>
              </thead>
              <tbody>
                {prog.map((progItem, index) => (
                  <tr key={index}>
                    <td>
                      <h5>{completed[index]?.course_name}</h5>
                    </td>
                    <td>
                      <p>{completed[index]?.course_description}</p>
                    </td>
                    <td>
                      <p>
                        {convertToDate(completed[index]?.updatedAt)} at{" "}
                        {extractTime(completed[index]?.updatedAt)}
                      </p>
                    </td>
                    <td>
                      <p>
                        {convertToDate(progItem?.updatedAt)} at{" "}
                        {extractTime(progItem?.updatedAt)}{" "}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Courses in Progress</h3>
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course Description</th>
                  <th>Started on</th>
                  <th>Current Progress(%)</th>
                </tr>
              </thead>
              <tbody>
                {current.map((progItem, index) => (
                  <tr key={index}>
                    <td>
                      <h5>{ongoing[index]?.course_name}</h5>
                    </td>
                    <td>
                      <p>{ongoing[index]?.course_description}</p>
                    </td>
                    <td>
                      <p>{extractTime(ongoing[index]?.updatedAt)}</p>
                    </td>
                    <td>
                      <p>{progItem?.progress}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3>Courses Created</h3>
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course Description</th>
                  <th>Created on</th>
                  <th>Number of Students</th>
                </tr>
              </thead>
              <tbody>
                {inst.map((student) => (
                  <tr>
                    <td>
                      <h5>{student.name}</h5>
                    </td>
                    <td>
                      <p>{student.description}</p>
                    </td>
                    <td>
                      <p>
                        {convertToDate(student.createdAt)} at{" "}
                        {extractTime(student.createdAt)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </>
    </div>
  );
};

export default Manage;
