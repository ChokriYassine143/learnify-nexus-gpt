const express = require('express');
const router = express.Router();
const ForumTopic = require('../models/ForumTopic');
const { validateForumTopicCreation } = require('../middleware/validationMiddleware');
const mongoose = require('mongoose');

// GET all forum topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await ForumTopic.find().populate('author', 'firstName lastName name avatar');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET forum topic by ID
router.get('/topics/:id', async (req, res) => {
  try {
    const topic = await ForumTopic.findById(req.params.id)
      .populate('author', 'firstName lastName name avatar')
      .populate('replies.author', 'firstName lastName name avatar');
    if (!topic) return res.status(404).json({ message: 'Forum topic not found' });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new forum topic
router.post('/topics', validateForumTopicCreation, async (req, res) => {
  try {
    console.log('Received forum topic data:', req.body);
    const topic = new ForumTopic({
      ...req.body,
      likes: [],
      isPinned: false,
      isLocked: false,
      views: 0,
      replies: []
    });

    const newTopic = await topic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating forum topic:', error);
    if (error.name === 'ValidationError') {
      console.log('Validation errors:', error.errors);
      const validationErrors = Object.values(error.errors).map(err => ({
        msg: err.message,
        param: err.path,
        value: err.value
      }));
      return res.status(400).json({ errors: validationErrors });
    }
    res.status(500).json({ 
      errors: [{ 
        msg: 'Error creating forum topic',
        param: 'server',
        value: null
      }]
    });
  }
});

// PATCH update forum topic
router.patch('/topics/:id', async (req, res) => {
  try {
    const updatedTopic = await ForumTopic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTopic) return res.status(404).json({ message: 'Forum topic not found' });
    res.json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE forum topic
router.delete('/topics/:id', async (req, res) => {
  try {
    const deletedTopic = await ForumTopic.findByIdAndDelete(req.params.id);
    if (!deletedTopic) return res.status(404).json({ message: 'Forum topic not found' });
    res.json({ message: 'Forum topic deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add reply to topic
router.post('/topics/:topicId/replies', async (req, res) => {
  try {
    const topic = await ForumTopic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Forum topic not found' });
    
    topic.replies.push(req.body);
    const updatedTopic = await topic.save();
    res.status(201).json(updatedTopic.replies[updatedTopic.replies.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update reply
router.patch('/topics/:topicId/replies/:replyId', async (req, res) => {
  try {
    const topic = await ForumTopic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Forum topic not found' });
    
    const reply = topic.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });
    
    Object.assign(reply, req.body);
    const updatedTopic = await topic.save();
    res.json(reply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE reply
router.delete('/topics/:topicId/replies/:replyId', async (req, res) => {
  try {
    const topic = await ForumTopic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Forum topic not found' });
    
    topic.replies.pull(req.params.replyId);
    await topic.save();
    res.json({ message: 'Reply deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST increment views
router.post('/topics/:id/views', async (req, res) => {
  try {
    const topic = await ForumTopic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Forum topic not found' });
    
    topic.views += 1;
    await topic.save();
    res.json({ views: topic.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH like/unlike a reply
router.patch('/topics/:topicId/replies/:replyId/like', async (req, res) => {
  const userId = req.body.userId;
  console.log('Reply like endpoint:', { userId, topicId: req.params.topicId, replyId: req.params.replyId });
  try {
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error('Invalid userId for ObjectId (reply like):', userId, err);
      return res.status(400).json({ message: 'Invalid userId for ObjectId' });
    }
    const topic = await ForumTopic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Forum topic not found' });

    const reply = topic.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    // Filter out any null/invalid entries
    reply.likes = reply.likes.filter(id => id && typeof id.toString === 'function');

    const index = reply.likes.findIndex(id => id.toString() === userObjectId.toString());
    if (index === -1) {
      reply.likes.push(userObjectId); // Like
    } else {
      reply.likes.splice(index, 1); // Unlike
    }
    await topic.save();
    res.json(reply);
  } catch (error) {
    console.error('Like endpoint error (reply):', error);
    res.status(400).json({ message: error.message });
  }
});

// PATCH like/unlike a forum topic
router.patch('/topics/:id/like', async (req, res) => {
  const userId = req.body.userId;
  console.log('Forum like endpoint:', { userId, type: typeof userId });
  try {
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error('Invalid userId for ObjectId (topic like):', userId, err);
      return res.status(400).json({ message: 'Invalid userId for ObjectId' });
    }
    const topic = await ForumTopic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Forum topic not found' });

    // Filter out any null/invalid entries
    topic.likes = topic.likes.filter(id => id && typeof id.toString === 'function');

    const index = topic.likes.findIndex(id => id.toString() === userObjectId.toString());
    if (index === -1) {
      topic.likes.push(userObjectId); // Like
    } else {
      topic.likes.splice(index, 1); // Unlike
    }
    await topic.save();
    res.json({ likes: topic.likes });
  } catch (error) {
    console.error('Like endpoint error (topic):', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 