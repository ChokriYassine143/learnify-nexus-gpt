const mongoose = require('mongoose');
const Course = require('./models/Course');
const Resource = require('./models/Resource');
require('dotenv').config();

async function updateResources() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(MONGODB_URI, { dbName: 'Learnup' }, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all courses
    const courses = await Course.find();
    console.log(`Found ${courses.length} courses`);

    let updatedCount = 0;
    let errorCount = 0;

    // Iterate through each course
    for (const course of courses) {
      console.log(`Processing course: ${course.title}`);

      // Iterate through each module
      for (const module of course.modules) {
        // Iterate through each lesson
        for (const lesson of module.lessons) {
          // Get the resources referenced in this lesson
          const lessonResources = lesson.resources || [];
          
          // Update each resource with the lessonId
          for (const resourceId of lessonResources) {
            try {
              const resource = await Resource.findById(resourceId);
              if (resource) {
                resource.lessonId = lesson._id;
                await resource.save();
                updatedCount++;
                console.log(`Updated resource: ${resource.title} with lessonId: ${lesson._id}`);
              }
            } catch (error) {
              console.error(`Error updating resource ${resourceId}:`, error);
              errorCount++;
            }
          }
        }
      }
    }

    console.log('\nUpdate Summary:');
    console.log(`Total resources updated: ${updatedCount}`);
    console.log(`Errors encountered: ${errorCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
updateResources(); 