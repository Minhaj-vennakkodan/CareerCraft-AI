const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  
  // Personal Info
  personalInfo: {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' }
  },

  // Sections
  summary: { type: String, default: '' },
  
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    gpa: String,
    description: String
  }],

  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String
  }],

  skills: [{
    name: String,
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert', 'None'], default: 'None' }
  }],

  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String
  }],

  certifications: [{
    name: String,
    issuer: String,
    issueDate: String,
    link: String
  }],

  achievements: [{
    title: String,
    description: String
  }],

  languages: [{
    name: String,
    proficiency: String
  }],

  customSections: [{
    title: String,
    content: String
  }],

  // Templates and Styling
  templateName: { type: String, default: 'Modern' },
  primaryColor: { type: String, default: '#0f172a' }, // Slate-900 default
  fontName: { type: String, default: 'Inter' },
  spacing: { type: String, default: 'Normal' } // Tight, Normal, Loose
  
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
