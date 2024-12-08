const mongoose = require("mongoose");
const initData = require("./data.js");
const quizQuestion=require("../model/questionSchema.js");

main().then((res) => {
    console.log("connection successfully");
}).catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/QuizApplication');
}
const initDB = async () => {
   await quizQuestion.deleteMany({});
   await quizQuestion.insertMany(initData.data);
   
    console.log("data was initialized");
  };
  
  initDB();