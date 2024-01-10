// src/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateToken(username, type) {
  const secretKey = generateStrongSecretKey();

  return jwt.sign(
    {username, type },
    secretKey,
    { algorithm: 'HS256', expiresIn: '1h' } // Adjust expiresIn as needed
  );
}

function generateStrongSecretKey() {
  const key = crypto.randomBytes(32); // 32 bytes = 256 bits
  return key.toString('base64').replace(/=/g, ''); // Remove padding
}

module.exports = {
  generateToken: generateToken,
  generateStrongSecretKey: generateStrongSecretKey,
};