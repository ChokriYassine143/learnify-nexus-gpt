const express = require('express');
const router = express.Router();
const CourseProgress = require('../models/CourseProgress');

// GET all course progress entries
router.get('/', async (req, res) => {
  try {
    const progressEntries = await CourseProgress.find();
    res.json(progressEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET course progress by ID
router.get('/:id', async (req, res) => {
  try {
    const progress = await CourseProgress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: 'Course progress not found' });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new course progress
router.post('/', async (req, res) => {
  const progress = new CourseProgress(req.body);
  try {
    const newProgress = await progress.save();
    res.status(201).json(newProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update course progress
router.put('/:id', async (req, res) => {
  try {
    const updatedProgress = await CourseProgress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProgress) return res.status(404).json({ message: 'Course progress not found' });
    res.json(updatedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE course progress
router.delete('/:id', async (req, res) => {
  try {
    const deletedProgress = await CourseProgress.findByIdAndDelete(req.params.id);
    if (!deletedProgress) return res.status(404).json({ message: 'Course progress not found' });
    res.json({ message: 'Course progress deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 