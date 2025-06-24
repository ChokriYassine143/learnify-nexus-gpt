const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dueDate: { type: Date, required: true },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentSubmission' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  maxScore: { type: Number, required: true },
  instructions: String,
  attachments: [String]
});

module.exports = mongoose.model('Assignment', AssignmentSchema); 