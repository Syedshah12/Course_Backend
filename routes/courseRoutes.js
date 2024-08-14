const express = require('express');
const upload = require('../upload');
const { createCourse, getCourses,updateCourse,deleteCourse } = require('../controllers/courseController');

const router = express.Router();

router.post('/courses', upload.single('thumbnail'), createCourse);
router.get('/courses', getCourses);
router.put('/courses/:courseId', upload.single('thumbnail'), updateCourse);
router.delete('/courses/:courseId', deleteCourse);

module.exports = router;
