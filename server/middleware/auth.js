const jwt = require('jsonwebtoken');
const mockDb = require('../database/mockDb');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careercraft_secret_key');

      if (global.isMockDb) {
        const user = mockDb.findOne('users', { _id: decoded.id });
        if (!user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        req.user = user;
      } else {
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
          return res.status(401).json({ success: false, message: 'Session invalid, please log in again' });
        }
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        req.user = user;
      }
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

module.exports = { protect, adminOnly };
