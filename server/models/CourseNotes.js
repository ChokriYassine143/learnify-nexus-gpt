const mongoose = require('mongoose');

const CourseNotesSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CourseNotes', CourseNotesSchema); 