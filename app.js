const express = require('express');
const multer = require('multer');
const path = require('path');
const connectDB = require('./config/db');
const courseRoutes = require('./routes/courseRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const videoRoutes = require('./routes/videoRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

connectDB();


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   });
  
//   const upload = multer({ storage });


app.use(express.json());

app.use('/api', courseRoutes);
app.use('/api', chapterRoutes);
app.use('/api', videoRoutes);
app.use('/api', quizRoutes);

module.exports = app;
