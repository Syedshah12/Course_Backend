const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    name: String,
    duration:String,
    description: String,
    thumbnail: String,
    totalVideos: {
        type: Number,
        default: 0, 
      },
      isLocked: {
        type: Boolean,
        default: true 
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
    
});

chapterSchema.pre('save', async function (next) {
  if (this.isNew) {
      const chapterCount = await mongoose.model('Chapter').countDocuments({ course: this.course });
      if (chapterCount === 0) {
          this.isLocked = false; 
      }
  }
  next();
});

const Chapter = mongoose.model('Chapter', chapterSchema);
module.exports = Chapter;
