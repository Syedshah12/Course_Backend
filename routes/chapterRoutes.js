const express = require('express');
const upload = require('../upload');
const { createChapter, getChaptersByCourse,updateChapter,deleteChapter } = require('../controllers/chapterController');

const router = express.Router();

router.post('/courses/:courseId/chapters', upload.single('thumbnail'), createChapter);
router.get('/courses/:courseId/chapters', getChaptersByCourse);
router.put('/chapters/:chapterId', upload.single('thumbnail'), updateChapter);
router.delete('/chapters/:chapterId', deleteChapter);

module.exports = router;
