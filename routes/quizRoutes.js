const express = require('express');
const { createQuiz, getQuizByVideo, updateQuiz, deleteQuiz,quizSubmit } = require('../controllers/quizController');

const router = express.Router();

router.post('/videos/:videoId/quiz', createQuiz);
router.get('/videos/:videoId/quiz', getQuizByVideo);
router.put('/videos/:videoId/quiz', updateQuiz);
router.delete('/videos/:videoId/quiz', deleteQuiz);
router.post('/videos/:videoId/quizSubmit', quizSubmit);

module.exports = router;
