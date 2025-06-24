const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// GET all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET quizzes by lessonId
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ lessonId: req.params.lessonId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new quiz
router.post('/', async (req, res) => {
  const quiz = new Quiz(req.body);
  try {
    const newQuiz = await quiz.save();

    // If lessonId is provided, push quiz._id to the lesson's quizzes array
    if (req.body.lessonId) {
      await Course.updateOne(
        { 'modules.lessons._id': req.body.lessonId },
        { $push: { 'modules.$[].lessons.$[l].quizzes': newQuiz._id } },
        { arrayFilters: [{ 'l._id': req.body.lessonId }] }
      );
    }

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update quiz
router.put('/:id', async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE quiz
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 