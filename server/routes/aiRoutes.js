const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getResumeSummary,
  getProjectDescription,
  getSkillSuggestions,
  getEnhancedResumeText,
  getATSAnalysis,
  getCoverLetter
} = require('../services/aiService');

const router = express.Router();

router.use(protect);

router.post('/resume-summary', async (req, res) => {
  const { skills, experience, education } = req.body;
  try {
    const summary = await getResumeSummary(skills, experience, education);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/project-description', async (req, res) => {
  const { projectName, technologies } = req.body;
  try {
    const bullets = await getProjectDescription(projectName, technologies);
    res.json({ success: true, bullets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/skills', async (req, res) => {
  const { jobRole, experience } = req.body;
  try {
    const skills = await getSkillSuggestions(jobRole, experience);
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/enhance', async (req, res) => {
  const { text } = req.body;
  try {
    const enhancedText = await getEnhancedResumeText(text);
    res.json({ success: true, text: enhancedText });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/ats-check', async (req, res) => {
  const { resumeData } = req.body;
  if (!resumeData) {
    return res.status(400).json({ success: false, message: 'Resume data is required' });
  }
  try {
    const analysis = await getATSAnalysis(resumeData);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/cover-letter', async (req, res) => {
  const { resumeData, jobTitle, companyName, jobDescription } = req.body;
  if (!resumeData) {
    return res.status(400).json({ success: false, message: 'Resume data is required' });
  }
  try {
    const coverLetter = await getCoverLetter(resumeData, jobTitle, companyName, jobDescription);
    res.json({ success: true, coverLetter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
