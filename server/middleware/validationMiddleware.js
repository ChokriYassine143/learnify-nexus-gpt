const { body, validationResult } = require('express-validator');

// Validation middleware for user registration
const validateUserRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Invalid role'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for course creation
const validateCourseCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  body('level')
    .trim()
    .notEmpty()
    .withMessage('Level is required')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid level'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for forum topic creation
const validateForumTopicCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 10 })
    .withMessage('Title must be at least 10 characters long'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 30 })
    .withMessage('Content must be at least 30 characters long'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  body('author')
    .isMongoId()
    .withMessage('Invalid author ID'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('courseId')
    .optional()
    .isMongoId()
    .withMessage('Invalid course ID'),

  (req, res, next) => {
    console.log('Validating forum topic data:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for assignment creation
const validateAssignmentCreation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('courseId').isMongoId().withMessage('Invalid course ID'),
  body('dueDate').isISO8601().withMessage('Invalid due date'),
  body('maxScore').isNumeric().withMessage('Max score must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for notification creation
const validateNotificationCreation = [
  body('userId').isMongoId().withMessage('Invalid user ID'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('type').isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for analytics update
const validateAnalyticsUpdate = [
  body('totalUsers').isNumeric().withMessage('Total users must be a number'),
  body('activeUsers').isNumeric().withMessage('Active users must be a number'),
  body('totalCourses').isNumeric().withMessage('Total courses must be a number'),
  body('activeCourses').isNumeric().withMessage('Active courses must be a number'),
  body('totalRevenue').isNumeric().withMessage('Total revenue must be a number'),
  body('monthlyRevenue').isNumeric().withMessage('Monthly revenue must be a number'),
  body('courseCompletionRate').isNumeric().withMessage('Course completion rate must be a number'),
  body('averageRating').isNumeric().withMessage('Average rating must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateUserRegistration,
  validateCourseCreation,
  validateForumTopicCreation,
  validateAssignmentCreation,
  validateNotificationCreation,
  validateAnalyticsUpdate
}; 