const Quiz = require('../models/Quiz');
const Video = require('../models/Video');
const Chapter = require('../models/Chapter');


exports.createQuiz = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const quiz = new Quiz({
      questions: req.body.questions,
      video: videoId
    });

    await quiz.save();
    video.quiz = quiz._id;
    await video.save();

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getQuizByVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const quiz = await Quiz.findOne({ video: videoId });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const videoId = req.params.videoId;

   
    const quiz = await Quiz.findOneAndUpdate(
      { video: videoId },
      { questions: req.body.questions },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteQuiz = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const quiz = await Quiz.findOneAndDelete({ video: videoId });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    await Video.findByIdAndUpdate(videoId, { $unset: { quiz: '' } });

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.quizSubmit = async (req, res) => {
    try {
      const videoId = req.params.videoId;
      const userAnswers = req.body.answers; 
      const quiz = await Quiz.findOne({ video: videoId }).populate('questions.options');
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      console.log('Quiz:', quiz);
      const allCorrect = quiz.questions.every(question => {
        const userAnswer = userAnswers.find(answer => answer.questionId === question._id.toString());
        if (!userAnswer) {
          console.log(`No user answer found for question ${question._id}`);
          return false;
        }
        const selectedOption = question.options.find(option => option._id.toString() === userAnswer.selectedOptionId);
        if (!selectedOption) {
          console.log(`No selected option found for question ${question._id}`);
          return false;
        }
        const isAnswerCorrect = selectedOption.isCorrect;
        console.log(`Question ID: ${question._id}, Selected Option ID: ${selectedOption._id}, Is Correct: ${isAnswerCorrect}`);
        return isAnswerCorrect;
      });
      console.log('All Correct:', allCorrect);
      if (allCorrect) {
        const currentVideo = await Video.findById(videoId);
        const nextVideo = await Video.findOne({
          chapter: currentVideo.chapter,
          _id: { $gt: videoId }
        }).sort({ _id: 1 });
        if (nextVideo) {
          nextVideo.isLocked = false;
          await nextVideo.save();
        }
        const allVideosUnlocked = !(await Video.exists({
          chapter: currentVideo.chapter,
          isLocked: true
        }));
        if (allVideosUnlocked) {
          const currentChapter = await Chapter.findById(currentVideo.chapter);
          const nextChapter = await Chapter.findOne({
            course: currentChapter.course,
            _id: { $gt: currentChapter._id }
          }).sort({ _id: 1 });
  
          if (nextChapter) {
            nextChapter.isLocked = false;
            await nextChapter.save();
          }
        }
        res.status(200).json({ message: 'Quiz passed' });
      } else {
        res.status(400).json({ message: 'Quiz failed' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  