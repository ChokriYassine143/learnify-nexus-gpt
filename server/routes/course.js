const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { validateCourseCreation } = require('../middleware/validationMiddleware');
const CourseProgress = require('../models/CourseProgress');
const CourseNotes = require('../models/CourseNotes');
const Resource = require('../models/Resource');
const CourseDiscussion = require('../models/CourseDiscussion');
const User = require('../models/User');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'modules.lessons.resources',
        model: 'Resource'
      })
      .populate({
        path: 'modules.lessons.quizzes',
        model: 'Quiz'
      });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new course
router.post('/', async (req, res) => {
  try {
    const courseData = req.body;
    
    // Create the course
    const course = new Course(courseData);
    
    // Save the course
    const savedCourse = await course.save();
    
    // If there are any resources in the lessons, create them
    for (const module of savedCourse.modules) {
      for (const lesson of module.lessons) {
        if (lesson.resources && lesson.resources.length > 0) {
          // Create each resource and link it to the lesson
          for (const resourceData of lesson.resources) {
            const resource = new Resource({
              ...resourceData,
              courseId: savedCourse._id,
              moduleId: module._id,
              lessonId: lesson._id
            });
            await resource.save();
          }
        }
      }
    }
    
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update course
router.put('/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE course
router.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET course progress by course ID and user ID
router.get('/:courseId/progress/:userId', async (req, res) => {
  try {
    const progress = await CourseProgress.findOne({
      courseId: req.params.courseId,
      userId: req.params.userId
    });
    
    if (!progress) {
      // Return null instead of 404 to indicate no progress exists yet
      return res.json(null);
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update course progress
router.put('/:courseId/progress', async (req, res) => {
  try {
    const { courseId } = req.params;
    const progressData = req.body;
    
    // Find existing progress or create new one
    let progress = await CourseProgress.findOne({
      courseId: courseId,
      userId: progressData.userId
    });
    
    if (!progress) {
      // Create new progress
      progress = new CourseProgress({
        courseId: courseId,
        userId: progressData.userId,
        ...progressData
      });
    } else {
      // Update existing progress
      Object.assign(progress, progressData);
    }
    
    const savedProgress = await progress.save();
    res.json(savedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET course notes by course ID and user ID
router.get('/:courseId/notes/:userId', async (req, res) => {
  try {
    const notes = await CourseNotes.findOne({
      courseId: req.params.courseId,
      userId: req.params.userId
    });
    
    if (!notes) {
      // Return empty notes if none exist
      return res.json({ notes: "" });
    }
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update course notes
router.put('/:courseId/notes', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, notes } = req.body;
    
    // Find existing notes or create new ones
    let courseNotes = await CourseNotes.findOne({
      courseId: courseId,
      userId: userId
    });
    
    if (!courseNotes) {
      // Create new notes
      courseNotes = new CourseNotes({
        courseId: courseId,
        userId: userId,
        notes: notes
      });
    } else {
      // Update existing notes
      courseNotes.notes = notes;
    }
    
    const savedNotes = await courseNotes.save();
    res.json(savedNotes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Middleware to check if user is enrolled or instructor
async function isEnrolledOrInstructor(req, res, next) {
  const userId = req.user?.userId || req.body.userId;
  const courseId = req.params.courseId || req.body.courseId;
  if (!userId || !courseId) return res.status(401).json({ message: 'Unauthorized' });
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructor.toString() === userId) return next();
  const user = await User.findById(userId);
  if (user && user.enrolledCourses && user.enrolledCourses.includes(courseId)) return next();
  return res.status(403).json({ message: 'Not enrolled in this course' });
}

// GET all discussions for a course
router.get('/:courseId/discussions', async (req, res) => {
  try {
    const discussions = await CourseDiscussion.find({ courseId: req.params.courseId });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new discussion to a course
router.post('/:courseId/discussions', isEnrolledOrInstructor, async (req, res) => {
  try {
    const { lessonId, userId, userName, content } = req.body;
    const discussion = new CourseDiscussion({
      courseId: req.params.courseId,
      lessonId,
      userId,
      userName,
      content
    });
    const saved = await discussion.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST a reply to a discussion
router.post('/:courseId/discussions/:discussionId/replies', isEnrolledOrInstructor, async (req, res) => {
  try {
    const { userId, userName, content } = req.body;
    const discussion = await CourseDiscussion.findById(req.params.discussionId);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });
    discussion.replies.push({ userId, userName, content });
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST enroll a user in a course
router.post('/:courseId/enroll', async (req, res) => {
  const { userId } = req.body;
  const { courseId } = req.params;
  if (!userId || !courseId) return res.status(400).json({ message: 'Missing userId or courseId' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }
    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 