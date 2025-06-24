require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
To change app.use(cors()); in your Node.js/Express application hosted at https://learnup-x1t1.onrender.com, you likely want to configure CORS (Cross-Origin Resource Sharing) more specifically to restrict or allow certain origins, methods, or headers, rather than enabling it for all requests (which is what app.use(cors()); does by default).

Here’s how you can modify it:

Install CORS (if not already installed):

bash

Collapse

Wrap

Run

Copy
npm install cors
Basic CORS Usage (Current Setup):

javascript

Collapse

Wrap

Run

Copy
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Allows all origins, methods, and headers
Modify CORS Configuration:
If you want to restrict CORS to specific origins (e.g., only allow requests from a specific frontend domain) or customize it, update the code like this:

javascript

Collapse

Wrap

Run

Copy
const express = require("express");
const cors = require("cors");
const app = express();

// Example: Restrict CORS to a specific origin
const corsOptions = {
  origin: "https://your-frontend-domain.com", // Replace with your frontend URL
  methods: ["GET", "POST"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true // Allow cookies or auth headers if needed
};

app.use(cors(corsOptions)); // Use custom CORS settings

// OR allow multiple origins dynamically
const allowedOrigins = ["https://frontend1.com", "https://localhost:3000"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('Serving uploads from:', path.join(__dirname, 'public/uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const MONGODB_URI = process.env.MONGODB_URI; // Replace with your MongoDB URI
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
