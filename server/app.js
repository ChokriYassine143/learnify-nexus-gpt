require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
const allowedOrigins = [
  'https://learnup-x1t1.onrender.com', // No trailing slash
  'http://localhost:3000', // For local development
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., non-browser clients like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked origin: ${origin}`); // Log for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
console.log('Serving uploads from:', path.join(__dirname, 'public/uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { dbName: 'Learnup' }, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Register routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/courses', require('./routes/course'));
app.use('/api/forums', require('./routes/forum'));
app.use('/api/assignments', require('./routes/assignment'));
app.use('/api/resources', require('./routes/resource'));
app.use('/api/quizzes', require('./routes/quiz'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api', require('./routes/conversation'));

app.get('/', (req, res) => {
  res.send('Learnify Nexus Backend API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
