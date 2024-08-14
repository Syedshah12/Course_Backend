const express = require('express');
const upload = require('../upload');
const { createVideo, getVideosByChapter,deleteVideo,updateVideo } = require('../controllers/videoController');

const router = express.Router();

router.post('/courses/:courseId/chapters/:chapterId/videos', upload.single('thumbnail'), createVideo);
router.get('/courses/:courseId/chapters/:chapterId/videos', getVideosByChapter);
router.put('/videos/:videoId', upload.single('thumbnail'), updateVideo);

router.delete('/videos/:videoId',deleteVideo);

module.exports = router;
