const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subjectName:{
        type:String,
        required:true,
    },
    subjectMark:{
        type:String,
        required:true,
    }
});

// Define MarkSchema with `mark` as an Array of Maps
const MarkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mark: {
    type:[SubjectSchema],
    required: true,
  },
}, {
  timestamps: true,
});

// Define AchievementSchema
const AchievementSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  marks: {
    type: [MarkSchema], // Array of MarkSchema
  },
}, {
  timestamps: true,
});

// Create the model
const AchievementModel = mongoose.model('achievement', AchievementSchema);

module.exports = AchievementModel;
