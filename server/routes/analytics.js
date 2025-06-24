const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { validateAnalyticsUpdate } = require('../middleware/validationMiddleware');

// GET analytics data
router.get('/', async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    if (!analytics) return res.status(404).json({ message: 'Analytics data not found' });
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update analytics data
router.put('/', validateAnalyticsUpdate, async (req, res) => {
  try {
    const updatedAnalytics = await Analytics.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedAnalytics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 