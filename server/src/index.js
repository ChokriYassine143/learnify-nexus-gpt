const path = require('path');

// Debug log for uploads directory
console.log('Serving uploads from:', path.join(__dirname, '../public/uploads'));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Test route for uploads
app.get('/uploads/test', (req, res) => {
  res.send('Uploads route is working!');
}); 