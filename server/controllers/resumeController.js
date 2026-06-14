const mongoose = require('mongoose');
const mockDb = require('../database/mockDb');
const Resume = require('../models/Resume');

const getResumes = async (req, res) => {
  try {
    let resumes;
    if (global.isMockDb) {
      resumes = mockDb.find('resumes', { userId: req.user._id });
    } else {
      resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    }
    res.json({ success: true, data: resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getResumeById = async (req, res) => {
  try {
    if (!global.isMockDb && !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    let resume;
    if (global.isMockDb) {
      resume = mockDb.findOne('resumes', { _id: req.params.id, userId: req.user._id });
    } else {
      resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('Get resume by id error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createResume = async (req, res) => {
  try {
    let existingCount = 0;
    if (global.isMockDb) {
      existingCount = mockDb.find('resumes', { userId: req.user._id }).length;
    } else {
      existingCount = await Resume.countDocuments({ userId: req.user._id });
    }

    // Free plan constraint: 1 resume max
    if (req.user.subscriptionTier === 'free' && existingCount >= 1) {
      return res.status(400).json({
        success: false,
        message: 'Free Plan allows only 1 resume. Please upgrade to Pro for unlimited resumes!'
      });
    }

    const defaultResume = {
      userId: req.user._id,
      title: req.body.title || 'My Resume',
      personalInfo: {
        name: req.user.name,
        title: 'Software Engineer',
        email: req.user.email,
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: ''
      },
      summary: 'Passionate and detail-oriented professional with experience in building web applications.',
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      customSections: [],
      templateName: 'Modern',
      primaryColor: '#0f172a',
      fontName: 'Inter',
      spacing: 'Normal'
    };

    let newResume;
    if (global.isMockDb) {
      newResume = mockDb.insert('resumes', defaultResume);
    } else {
      newResume = await Resume.create(defaultResume);
    }

    res.status(201).json({ success: true, data: newResume });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateResume = async (req, res) => {
  try {
    if (!global.isMockDb && !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    let resume;
    if (global.isMockDb) {
      resume = mockDb.findOne('resumes', { _id: req.params.id, userId: req.user._id });
    } else {
      resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
    }

    let updatedResume;
    if (global.isMockDb) {
      mockDb.update('resumes', { _id: req.params.id }, req.body);
      updatedResume = mockDb.findOne('resumes', { _id: req.params.id });
    } else {
      updatedResume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    }

    res.json({ success: true, data: updatedResume });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    if (!global.isMockDb && !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    let result;
    if (global.isMockDb) {
      result = mockDb.delete('resumes', { _id: req.params.id, userId: req.user._id });
    } else {
      result = await Resume.deleteOne({ _id: req.params.id, userId: req.user._id });
      result = result.deletedCount;
    }

    if (!result) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
    }

    // Clean up corresponding portfolios if any
    if (global.isMockDb) {
      mockDb.delete('portfolios', { resumeId: req.params.id });
    } else {
      const Portfolio = require('../models/Portfolio');
      await Portfolio.deleteMany({ resumeId: req.params.id });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getResumes, getResumeById, createResume, updateResume, deleteResume };
