const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String, 
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  questionText: String, 
  options: [optionSchema] 
});

const quizSchema = new mongoose.Schema({
  questions: [questionSchema], 
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true } 
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
