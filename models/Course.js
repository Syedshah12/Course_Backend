const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: String,
    duration:String,
    description: String,
    thumbnail: String,
    totalChapters: {
        type: Number,
        default: 0,
      },
    
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
