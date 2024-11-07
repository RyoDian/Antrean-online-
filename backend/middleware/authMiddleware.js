const jwt = require('jsonwebtoken');
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const token = req.cookies.token; // Ambil token dari cookie

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  const JWT_SECRET = process.env.JWT_SECRET

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(verified.id);
    next();
  } catch (error) {
    console.error("Token verification error:", error.message); // Debugging error
    res.status(400).json({ message: 'Invalid token' });
  }
};
