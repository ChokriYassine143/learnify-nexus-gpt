const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Get conversation for a user
router.get('/users/:userId/conversations', async (req, res) => {
  try {
    let convo = await Conversation.findOne({ userId: req.params.userId });
    if (!convo) return res.json([]);
    res.json(convo.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a message to a user's conversation
router.post('/users/:userId/conversations', async (req, res) => {
  try {
    let convo = await Conversation.findOne({ userId: req.params.userId });
    if (!convo) {
      convo = new Conversation({ userId: req.params.userId, messages: [] });
    }
    convo.messages.push(req.body);
    await convo.save();
    res.status(201).json(req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user's conversation
router.delete('/users/:userId/conversations', async (req, res) => {
  try {
    await Conversation.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 