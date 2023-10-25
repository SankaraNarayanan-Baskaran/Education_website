import React from 'react';
import "./Footer.css";
const Footer = () => {
  const year=new Date().getFullYear();
  return (
    <footer>
      <div className='footer' style={{
       
        marginBottom:"0"
      }}>
        <h6> © Copyright {year} EduWeb</h6>
      </div>
    </footer>
  );
};

export default Footer;
