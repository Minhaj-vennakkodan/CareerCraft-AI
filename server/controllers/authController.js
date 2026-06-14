const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mockDb = require('../database/mockDb');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careercraft_secret_key', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  try {
    let userExists;
    if (global.isMockDb) {
      userExists = mockDb.findOne('users', { email: email.toLowerCase() });
    } else {
      userExists = await User.findOne({ email: email.toLowerCase() });
    }

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (global.isMockDb) {
      newUser = mockDb.insert('users', {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: email.toLowerCase() === 'admin@careercraft.ai' ? 'admin' : 'user',
        subscriptionTier: 'free',
        googleId: null
      });
    } else {
      newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: email.toLowerCase() === 'admin@careercraft.ai' ? 'admin' : 'user',
        subscriptionTier: 'free'
      });
    }

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        subscriptionTier: newUser.subscriptionTier,
        token: generateToken(newUser._id)
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields' });
  }

  try {
    let user;
    if (global.isMockDb) {
      user = mockDb.findOne('users', { email: email.toLowerCase() });
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;

  if (!email || !name || !googleId) {
    return res.status(400).json({ success: false, message: 'Missing Google credentials' });
  }

  try {
    let user;
    if (global.isMockDb) {
      user = mockDb.findOne('users', { email: email.toLowerCase() });
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      // Create user if not exists
      const salt = await bcrypt.genSalt(10);
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), salt);
      if (global.isMockDb) {
        user = mockDb.insert('users', {
          name,
          email: email.toLowerCase(),
          password: dummyPassword,
          role: 'user',
          subscriptionTier: 'free',
          googleId
        });
      } else {
        user = await User.create({
          name,
          email: email.toLowerCase(),
          password: dummyPassword,
          role: 'user',
          subscriptionTier: 'free',
          googleId
        });
      }
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      subscriptionTier: req.user.subscriptionTier
    }
  });
};

const updateProfile = async (req, res) => {
  const { name, password, subscriptionTier } = req.body;
  const updateData = {};
  if (name) updateData.name = name;
  if (subscriptionTier) updateData.subscriptionTier = subscriptionTier; // Simulating plan upgrade

  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    let updatedUser;
    if (global.isMockDb) {
      mockDb.update('users', { _id: req.user._id }, updateData);
      updatedUser = mockDb.findOne('users', { _id: req.user._id });
    } else {
      updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    }

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionTier: updatedUser.subscriptionTier
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, googleLogin, getProfile, updateProfile };
