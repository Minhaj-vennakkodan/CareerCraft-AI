const express = require('express');
const { getPortfolioByResume, createOrUpdatePortfolio, getPublicPortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/resume/:resumeId', protect, getPortfolioByResume);
router.post('/', protect, createOrUpdatePortfolio);
router.get('/slug/:slug', getPublicPortfolio); // Public endpoint

module.exports = router;
