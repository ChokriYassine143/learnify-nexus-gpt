const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  totalUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  totalCourses: { type: Number, default: 0 },
  activeCourses: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  courseCompletionRate: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  topCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  topInstructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema); 