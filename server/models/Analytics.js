const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetId: { type: mongoose.Schema.Types.ObjectId }, // Resume or Portfolio ID
  targetType: { type: String, enum: ['resume', 'portfolio'], required: true },
  actionType: { type: String, enum: ['view', 'download'], required: true },
  source: { type: String, default: 'direct' }, // direct, linkedin, github, search, other
  visitorIp: { type: String, default: '' },
  visitorAgent: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
