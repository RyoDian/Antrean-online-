const jwt = require('jsonwebtoken');

exports.generateJwt = (userId, role) => {
  const payload = { id: userId, role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }); // Token berlaku 1 hari
};