const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  };


  //register of a user
router.post("/register", async (req, res) => {
try {
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      company
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        token: generateToken(user?.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


// Login of a user
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // check fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
      }
  
      // check user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // generate token
      const token = generateToken(user._id);
  
      // store token in cookie
      res.cookie('token', token, {
        httpOnly: true,  // Ensures the cookie can't be accessed via JavaScript
        secure: process.env.NODE_ENV === 'production',  // If running in production, cookie should be secure (HTTPS)
        sameSite: 'strict',  // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week
      });
  
      // send user info back
      res.status(200).json({
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});



//  Logout a user
router.post("/logout", (req, res) => {
    try {
      res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Expire the cookie immediately
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
  
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during logout' });
    }
  });
  
module.exports = router;
