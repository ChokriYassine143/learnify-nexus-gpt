const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedLessons: [{ type: String }],
  currentModuleIndex: { type: Number, default: 0 },
  currentLessonIndex: { type: Number, default: 0 },
  lastAccessedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' }
});

module.exports = mongoose.model('CourseProgress', CourseProgressSchema); 