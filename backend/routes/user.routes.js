// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const createTokenAndCookie = require('../utils/createTokenAndCookie.cjs');

// ----------------- REGISTER -----------------
router.post('/register', async (req, res) => {
  const { name, email, password, location, contact, role } = req.body;

  if (!name || !email || !password || !location || !contact || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      contact,
      role,
    });

    // Create JWT cookie
    createTokenAndCookie(res, newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.toString() });
  }
});

// ----------------- LOGIN -----------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT cookie
    createTokenAndCookie(res, user);

    res.json({
      message: 'Login successful',
      user: {
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.toString() });
  }
});

// ----------------- GET USER PROFILE -----------------
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      'name email role location contact skills'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location || '',
      contact: user.contact || '',
      skills: user.skills || []
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------- UPDATE USER PROFILE -----------------
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, location, contact, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        location,
        contact,
        skills  // This will add/update the skills field
      },
      { new: true, runValidators: true } // Returns updated doc
    ).select('name email role location contact skills');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        contact: user.contact,
        skills: user.skills
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
