const mongoose = require('mongoose');

// Qustions Schema 
const questionSchema = new mongoose.Schema({
  questionText: String,
  options:  [String],
  correctAnswer: String
});

// Create and export the model
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

