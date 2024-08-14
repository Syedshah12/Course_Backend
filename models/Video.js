const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: String,
    url: String,
    thumbnail: String,
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    isLocked: {
        type: Boolean,
        default: true 
    }
  
});

videoSchema.pre('save', async function (next) {
    if (this.isNew) {
        const videoCount = await mongoose.model('Video').countDocuments({ chapter: this.chapter });
        if (videoCount === 0) {
            this.isLocked = false;
        }
    }
    next();
});



const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
