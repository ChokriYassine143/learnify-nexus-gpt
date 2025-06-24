const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateUserRegistration } = require('../middleware/validationMiddleware');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/authMiddleware');

// GET all users (admin only)
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user by ID (admin or self)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or requesting their own data
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to access this user data' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new user (admin only)
router.post('/', auth, requireRole('admin'), validateUserRegistration, async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update user (admin or self)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or updating their own data
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    let updateData = { ...req.body };
    if (updateData.name) {
      const nameParts = updateData.name.trim().split(' ');
      updateData.firstName = nameParts[0] || '';
      updateData.lastName = nameParts.slice(1).join(' ') || '';
      delete updateData.name;
    }

    // Prevent non-admin users from updating certain fields
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.isDisabled;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user (admin only)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user enrollments (admin or self)
router.get('/:userId/enrollments', auth, async (req, res) => {
  try {
    // Check if user is admin or requesting their own enrollments
    if (req.user.role !== 'admin' && req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to access these enrollments' });
    }

    const user = await User.findById(req.params.userId).populate('enrolledCourses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.enrolledCourses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET public instructor info by ID (accessible to all)
router.get('/:id/public', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('firstName lastName name avatar bio');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all users enrolled in a specific course (teacher or admin)
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    // Only allow teachers or admins
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const users = await User.find({ enrolledCourses: req.params.courseId }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 