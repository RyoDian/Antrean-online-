const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateJwt } = require('../middleware/authUtils');
const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')

// Validasi format ID
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, } = req.body;

  try {
    // Validasi Input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (phone && !validator.isMobilePhone(phone, 'any')) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    // Buat user baru dengan role 'user'
    const newUser = new User({
      name,
      email,
      password,
      phone,
      role: 'user',
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User dengan Pengalihan Berdasarkan Role
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } if( !(await user.comparePassword(password))){
      return res.status(400).json({ message: 'Invalid password' });

    }

    const token = generateJwt(user.id, user.role);
    const redirectUrl = user.role === 'admin' 
      ? '/admin/dashboard' 
      : user.role === 'super-admin' 
      ? '/super-admin/dashboard' 
      : '/user/dashboard';

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(Date.now() + 86400000), // 1 hari
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      redirectUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//loginstatus
exports.loginStatus = async ( req , res )=>{

 const token = req.cookies.token;

  // Cek apakah token ada
  if (!token) {
    return res.json(false);
  }

  try {
    // Verifikasi token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    // Jika terjadi error saat verifikasi (misalnya token tidak valid atau expired)
    console.error("Token verification failed:", error.message);
    return res.json(false);
  }
}

//logout
exports.logout = async ( req , res ) =>{
  res.cookie("token" , "",{
    path:"/",
    httpOnly : true,
    expires : new Date(0),
    sameSite : "none",
    secure : true ,
  }).json({message : " Logout Berhasil "})
}

exports.createAdminOrSuperAdmin = async (req, res) => {
  const { name, email, password, phone, role, location} = req.body;

  try {
    console.log(req.body); 
    // Validasi Input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, role and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (phone && !validator.isMobilePhone(phone, 'any')) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    // Buat user baru dengan role 'user'
    const newUser = new User({
      name,
      email,
      password,
      phone,
      role,
      location,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        location:newUser.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update Admin atau Super Admin
exports.updateAdminOrSuperAdmin = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid ID format' });

  const { name, email, phone, bio, photo, role, location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id, { name, email, phone, bio, photo, role, location }, { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Admin atau Super Admin
exports.deleteAdminOrSuperAdmin = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Admins and Super Admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'super-admin'] } });
    res.status(200).json({ status: 'success', data: admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Admin or Super Admin by ID
exports.getAdminById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const user = await User.findById(id);
    if (!user || !['admin', 'super-admin'].includes(user.role)) {
      return res.status(404).json({ message: 'Admin or Super Admin not found' });
    }

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
