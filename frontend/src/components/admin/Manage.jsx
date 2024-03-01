import React, { useEffect, useState } from "react";
import { config } from "../../App";
import Header from "../Header";
import { useCookies } from "react-cookie";
import axios from "axios";
const Manage = () => {
  const [completed, setCompleted] = useState([]);
  const [cookies] = useCookies(["username","studentname","icon","role"]);
  const [ongoing, setOngoing] = useState([]);
  const [inst,setInst]=useState([]);
  const [prog, setProg] = useState([]);
  const [current, setCurrent] = useState([]);
  const [students,setStudents]=useState([]);
  const fetchCompleted = async (username) => {
    try {
      const res = await axios.get(
        `${config.endpoint}/admin/completed`,
        {
          params: {
            username: username,
          },
        },
       
      );
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
      const resp = await axios.get(
        `${config.endpoint}/admin/ongoing`,
        {
          params: {
            username: username,
          },
        },
        
      );
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
      const resp = await axios.get(
        `${config.endpoint}/admin/fetchinst`,
        {
          params: {
            username: username,
          },
        },
        
      );
      if (resp) {
        const { courseDetails, purchased } = resp.data;
       setInst(courseDetails);
       setStudents(purchased);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const username=localStorage.getItem("studentname")
    console.log(username)
    fetchCompleted(username);
    fetchOngoing(username);
    fetchInstructor(username);
  }, []);
  return (
    <div>
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
                <p>{completed[index]?.updatedAt}</p>
              </td>
              <td>
                <p>{progItem?.updatedAt}</p>

                
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
                <p>{ongoing[index]?.updatedAt}</p>
              </td>
              <td>
                <p>{progItem?.progress}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
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
                <p>{student.updatedAt}</p>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Manage;
