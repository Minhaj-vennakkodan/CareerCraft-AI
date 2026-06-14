const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  slug: { type: String, required: true, unique: true },
  themeName: { type: String, default: 'Modern Developer' }, // Modern Developer, Corporate, Creative, Minimal, Dark Professional
  
  // Customization
  aboutMe: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  },

  // Sections toggle
  sectionsVisibility: {
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  },

  visitCounter: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
