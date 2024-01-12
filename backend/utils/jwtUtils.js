// src/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (username, type) => {
  const SECRET_KEY=generateStrongSecretKey()
  const tokenData = {
    username: username,
    type: 'student',
    // Add other claims or data you want in the token
  };

  const options = {
    expiresIn: '1h', // Set the token expiration time as needed
  };


  const token = jwt.sign(tokenData, SECRET_KEY, options);
  return token;
};

function generateStrongSecretKey() {
  const key = crypto.randomBytes(32); // 32 bytes = 256 bits
  return key.toString('base64').replace(/=/g, ''); // Remove padding
}

module.exports = {
  generateToken: generateToken,
  generateStrongSecretKey: generateStrongSecretKey,
};