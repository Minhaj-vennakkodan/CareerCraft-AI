const mockDb = require('../database/mockDb');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Portfolio = require('../models/Portfolio');
const Analytics = require('../models/Analytics');

const getUsers = async (req, res) => {
  try {
    let users;
    if (global.isMockDb) {
      users = mockDb.find('users');
    } else {
      users = await User.find({}).select('-password').sort({ createdAt: -1 });
    }
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Admin getUsers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserTier = async (req, res) => {
  const { userId, subscriptionTier, role } = req.body;
  const updateData = {};
  if (subscriptionTier) updateData.subscriptionTier = subscriptionTier;
  if (role) updateData.role = role;

  try {
    let updatedUser;
    if (global.isMockDb) {
      mockDb.update('users', { _id: userId }, updateData);
      updatedUser = mockDb.findOne('users', { _id: userId });
    } else {
      updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Admin updateUserTier error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    let result;
    if (global.isMockDb) {
      result = mockDb.delete('users', { _id: id });
    } else {
      result = await User.findByIdAndDelete(id);
    }

    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Clean up related resumes, portfolios, analytics
    if (global.isMockDb) {
      mockDb.delete('resumes', { userId: id });
      mockDb.delete('portfolios', { userId: id });
      mockDb.delete('analytics', { userId: id });
    } else {
      await Resume.deleteMany({ userId: id });
      await Portfolio.deleteMany({ userId: id });
      await Analytics.deleteMany({ userId: id });
    }

    res.json({ success: true, message: 'User and all related data deleted successfully' });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    let totalUsers = 0;
    let proUsersCount = 0;
    let totalResumes = 0;
    let totalPortfolios = 0;
    let totalDownloads = 0;

    if (global.isMockDb) {
      const users = mockDb.find('users');
      const resumes = mockDb.find('resumes');
      const portfolios = mockDb.find('portfolios');
      const analytics = mockDb.find('analytics');

      totalUsers = users.length;
      proUsersCount = users.filter(u => u.subscriptionTier === 'pro').length;
      totalResumes = resumes.length;
      totalPortfolios = portfolios.length;
      totalDownloads = analytics.filter(a => a.actionType === 'download').length;
    } else {
      totalUsers = await User.countDocuments({});
      proUsersCount = await User.countDocuments({ subscriptionTier: 'pro' });
      totalResumes = await Resume.countDocuments({});
      totalPortfolios = await Portfolio.countDocuments({});
      totalDownloads = await Analytics.countDocuments({ actionType: 'download' });
    }

    // Pro is $12/month
    const monthlyRevenue = proUsersCount * 12;

    res.json({
      success: true,
      data: {
        totalUsers,
        proUsersCount,
        freeUsersCount: totalUsers - proUsersCount,
        totalResumes,
        totalPortfolios,
        totalDownloads,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, updateUserTier, deleteUser, getAdminStats };
