const mongoose = require('mongoose');
const mockDb = require('../database/mockDb');
const Portfolio = require('../models/Portfolio');
const Resume = require('../models/Resume');
const Analytics = require('../models/Analytics');

const getPortfolioByResume = async (req, res) => {
  try {
    if (!global.isMockDb && !mongoose.Types.ObjectId.isValid(req.params.resumeId)) {
      return res.json({ success: true, data: null });
    }
    let portfolio;
    if (global.isMockDb) {
      portfolio = mockDb.findOne('portfolios', { resumeId: req.params.resumeId, userId: req.user._id });
    } else {
      portfolio = await Portfolio.findOne({ resumeId: req.params.resumeId, userId: req.user._id });
    }

    if (!portfolio) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrUpdatePortfolio = async (req, res) => {
  const { resumeId, slug, themeName, aboutMe, contactEmail, socialLinks, sectionsVisibility } = req.body;

  if (!resumeId || !slug) {
    return res.status(400).json({ success: false, message: 'Resume ID and slug are required' });
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');

  try {
    if (!global.isMockDb && !mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ success: false, message: 'Invalid Resume ID format' });
    }
    // Check if slug is taken by another user
    let slugExists;
    if (global.isMockDb) {
      slugExists = mockDb.findOne('portfolios', { slug: cleanSlug });
    } else {
      slugExists = await Portfolio.findOne({ slug: cleanSlug });
    }

    // Load original resume to ensure ownership
    let resume;
    if (global.isMockDb) {
      resume = mockDb.findOne('resumes', { _id: resumeId, userId: req.user._id });
    } else {
      resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    let existingPortfolio;
    if (global.isMockDb) {
      existingPortfolio = mockDb.findOne('portfolios', { resumeId, userId: req.user._id });
    } else {
      existingPortfolio = await Portfolio.findOne({ resumeId, userId: req.user._id });
    }

    if (slugExists && (!existingPortfolio || existingPortfolio.slug !== cleanSlug)) {
      return res.status(400).json({ success: false, message: 'URL Slug is already taken by another user' });
    }

    // Plan checks
    if (!existingPortfolio) {
      let existingCount = 0;
      if (global.isMockDb) {
        existingCount = mockDb.find('portfolios', { userId: req.user._id }).length;
      } else {
        existingCount = await Portfolio.countDocuments({ userId: req.user._id });
      }

      if (req.user.subscriptionTier === 'free' && existingCount >= 1) {
        return res.status(400).json({
          success: false,
          message: 'Free Plan allows only 1 portfolio website. Please upgrade to Pro for unlimited portfolios!'
        });
      }
    }

    const portfolioData = {
      userId: req.user._id,
      resumeId,
      slug: cleanSlug,
      themeName: themeName || 'Modern Developer',
      aboutMe: aboutMe || resume.summary || '',
      contactEmail: contactEmail || resume.personalInfo.email || req.user.email,
      socialLinks: socialLinks || {
        github: resume.personalInfo.github || '',
        linkedin: resume.personalInfo.linkedin || '',
        twitter: '',
        website: resume.personalInfo.website || ''
      },
      sectionsVisibility: sectionsVisibility || {
        about: true,
        skills: true,
        experience: true,
        projects: true,
        certifications: true,
        contact: true
      }
    };

    let savedPortfolio;
    if (existingPortfolio) {
      if (global.isMockDb) {
        mockDb.update('portfolios', { _id: existingPortfolio._id }, portfolioData);
        savedPortfolio = mockDb.findOne('portfolios', { _id: existingPortfolio._id });
      } else {
        savedPortfolio = await Portfolio.findByIdAndUpdate(existingPortfolio._id, portfolioData, { new: true });
      }
    } else {
      if (global.isMockDb) {
        savedPortfolio = mockDb.insert('portfolios', portfolioData);
      } else {
        savedPortfolio = await Portfolio.create(portfolioData);
      }
    }

    res.json({ success: true, data: savedPortfolio });
  } catch (error) {
    console.error('Create/Update portfolio error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicPortfolio = async (req, res) => {
  const { slug } = req.params;

  try {
    let portfolio;
    if (global.isMockDb) {
      portfolio = mockDb.findOne('portfolios', { slug: slug.toLowerCase() });
    } else {
      portfolio = await Portfolio.findOne({ slug: slug.toLowerCase() });
    }

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    let resume;
    if (global.isMockDb) {
      resume = mockDb.findOne('resumes', { _id: portfolio.resumeId });
    } else {
      resume = await Resume.findById(portfolio.resumeId);
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Corresponding resume data not found' });
    }

    // Register analytics view
    const source = req.query.ref || 'direct';
    const actionLog = {
      userId: portfolio.userId,
      targetId: portfolio._id,
      targetType: 'portfolio',
      actionType: 'view',
      source,
      visitorIp: req.ip || '',
      visitorAgent: req.headers['user-agent'] || ''
    };

    if (global.isMockDb) {
      mockDb.insert('analytics', actionLog);
      mockDb.update('portfolios', { _id: portfolio._id }, { visitCounter: (portfolio.visitCounter || 0) + 1 });
    } else {
      await Analytics.create(actionLog);
      await Portfolio.findByIdAndUpdate(portfolio._id, { $inc: { visitCounter: 1 } });
    }

    res.json({
      success: true,
      data: {
        portfolio,
        resume
      }
    });
  } catch (error) {
    console.error('Public portfolio view error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPortfolioByResume, createOrUpdatePortfolio, getPublicPortfolio };
