const Chapter = require('../models/Chapter');
const Course = require('../models/Course');
const Video = require('../models/Video');
const Quiz = require('../models/Quiz');


exports.createChapter = async (req, res) => {
    try {
      const { name,duration, description } = req.body; 
      const courseId = req.params.courseId;    
      const thumbnail = req.file?.path;
      
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const chapter = new Chapter({
        name,
        duration,
        description,
        thumbnail,
        course: courseId, 
      });
  
      await chapter.save();
      await Course.findByIdAndUpdate(courseId, { $inc: { totalChapters: 1 } });
      res.status(201).json(chapter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    
  };
  

exports.getChaptersByCourse = async (req, res) => {
  try {
    const chapters = await Chapter.find({ course: req.params.courseId });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateChapter = async (req, res) => {
    try {
      const { name, description,duration } = req.body;
      const chapterId = req.params.chapterId;
      const updateData = { name, description,duration };
  
      if (req.file) {
        updateData.thumbnail = req.file.path;
      }
  
      const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, updateData, { new: true });
  
      if (!updatedChapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
  
      res.status(200).json(updatedChapter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  exports.deleteChapter = async (req, res) => {
    try {
      const chapterId = req.params.chapterId;
        const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
      
      const videos = await Video.find({ chapter: chapterId });
  
      if (videos.length > 0) {
        const videoIds = videos.map(video => video._id);
        await Quiz.deleteMany({ video: { $in: videoIds } });
        await Video.deleteMany({ chapter: chapterId });
      }

      const deletedChapter = await Chapter.findByIdAndDelete(chapterId);
      if (!deletedChapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
        await Course.findByIdAndUpdate(chapter.course, { $inc: { totalChapters: -1 } });
  
      res.status(200).json({ message: 'Chapter and related videos and quizzes deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  