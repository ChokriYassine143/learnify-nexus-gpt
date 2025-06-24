const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['document', 'video', 'link', 'other'], required: true },
  url: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 },
  size: Number
});

module.exports = mongoose.model('Resource', ResourceSchema); 