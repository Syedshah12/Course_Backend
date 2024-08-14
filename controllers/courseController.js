const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Video = require('../models/Video');
const Quiz = require('../models/Quiz');

exports.createCourse = async (req, res) => {
    try {
      const { name, description,duration } = req.body;
      const thumbnail = req.file.path;
  
      const course = new Course({
        name,
        description,
        duration,
        thumbnail,
      });
  
      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const chapters = await Chapter.find({ course: courseId }).exec();

    if (chapters.length > 0) {
      const chapterIds = chapters.map(chapter => chapter._id);
      const videos = await Video.find({ chapter: { $in: chapterIds } }).exec();

      if (videos.length > 0) {
        const videoIds = videos.map(video => video._id);
        await Quiz.deleteMany({ video: { $in: videoIds } }).exec();
        await Video.deleteMany({ chapter: { $in: chapterIds } }).exec();
      }
      await Chapter.deleteMany({ course: courseId }).exec();
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId).exec();

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ message: 'Course and related chapters, videos, and quizzes deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




  exports.updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { name,duration, description } = req.body;
      const updateData = {};
  
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (duration) updateData.duration = duration;
      if (req.file) updateData.thumbnail = req.file.path;
  
      const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
  
      if (!updatedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.status(200).json(updatedCourse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


