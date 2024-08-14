const Video = require('../models/Video');
const Chapter = require('../models/Chapter');
const Quiz = require('../models/Quiz');

exports.createVideo = async (req, res) => {
  try {
    const { title, url} = req.body;
    const chapterId = req.params.chapterId; 
    const thumbnail = req.file.path;
  const chapter=await Chapter.findById(chapterId);

  if(!chapter){
    return res.status(404).json({ error: 'Chapter Not Found' });
  }

    const video = new Video({
      title,
      url,
      thumbnail,
      chapter: chapterId,
    });

    await video.save();
    await Chapter.findByIdAndUpdate(chapterId, { $inc: { totalVideos: 1 } });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVideosByChapter = async (req, res) => {
  try {
    const videos = await Video.find({ chapter: req.params.chapterId });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const { title, url } = req.body;
    const updateData = { title, url };

    if (req.file) {
      updateData.thumbnail = req.file.path;
    }
    
    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, { new: true });
    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await Quiz.deleteOne({ video: videoId });
    await Video.findByIdAndDelete(videoId);
    await Chapter.findByIdAndUpdate(video.chapter, { $inc: { totalVideos: -1 } });
    res.status(200).json({ message: 'Video and related quiz deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



