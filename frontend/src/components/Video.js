import React from "react";
import video from "../Videos/video.mp4";
import "./Video.css"
const VideoPlayer = ({source}) => {
  return (
    <div className="centered-controls">
      <center>
        <video width="285" height="165" controls>
       
          <source src={source} type="video/mp4"/> 
        </video>

      </center>
    </div>
  );
};

export default VideoPlayer;