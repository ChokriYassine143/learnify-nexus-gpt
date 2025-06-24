const mongoose = require('mongoose');

const QuizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer'], required: true },
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  points: { type: Number, default: 1 },
  explanation: String
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  questions: [QuizQuestionSchema],
  timeLimit: Number,
  passingScore: { type: Number, default: 0 },
  attempts: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }
});

module.exports = mongoose.model('Quiz', QuizSchema); 