const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to only allow specific file types
const fileFilter = (req, file, cb) => {
  // Allow video files
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// Configure multer with file size limits and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
  }
});

// GET all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new resource
router.post('/', async (req, res) => {
  try {
    const resourceData = req.body;
    
    // Create the resource
    const resource = new Resource(resourceData);
    const savedResource = await resource.save();
    
    // If the resource is associated with a lesson, update the lesson's resources array
    if (resourceData.lessonId) {
      const course = await Course.findOne({ 'modules.lessons._id': resourceData.lessonId });
      if (course) {
        for (const module of course.modules) {
          const lesson = module.lessons.find(l => l._id.toString() === resourceData.lessonId);
          if (lesson) {
            lesson.resources = lesson.resources || [];
            lesson.resources.push(savedResource._id);
            await course.save();
            break;
          }
        }
      }
    }
    
    res.status(201).json(savedResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update resource
router.put('/:id', async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResource) return res.status(404).json({ message: 'Resource not found' });
    res.json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE resource
router.delete('/:id', async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET resources by lessonId
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    console.log('Fetching resources for lessonId:', req.params.lessonId);
    const resources = await Resource.find({ lessonId: req.params.lessonId });
    console.log('Found resources:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching lesson resources:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload endpoint hit. File:', req.file);
    if (!req.file) {
      console.error('No file uploaded!');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Create a relative URL for the file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 