const mongoose = require('mongoose');

const CourseModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [{
    title: { type: String, required: true },
    content: String,
    order: Number,
    locked: Boolean,
    duration: Number,
    type: { type: String, enum: ['video', 'reading', 'assignment', 'quiz'], required: true },
    resources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }],
    completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
  }]
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: String,
  level: String,
  duration: String,
  price: Number,
  rating: { type: Number, default: 0 },
  enrolled: { type: Boolean, default: false },
  modules: [CourseModuleSchema],
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  requirements: [String],
  objectives: [String],
  tags: [String],
  enrolledStudents: { type: Number, default: 0 }
});

module.exports = mongoose.model('Course', CourseSchema); 