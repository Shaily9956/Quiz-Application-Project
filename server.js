const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/UserModel.js');
const Question=require('./model/questionSchema.js');
const session = require('express-session');
const newUserQuery = require('./model/QueryModel.js');
const path = require("path");
const { request } = require("http");
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'quizApplication',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/Javascript', express.static(path.join(__dirname, 'Javascript')));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});


app.post("/quizApplication/signUp", async (req, res) => {
  try {
    let { username, email, phoneNumber, password, confirmpassword } = req.body;
    if (password !== confirmpassword) {
      res.json({ message: "Passwords do not match" });
    }
    let newUser = new User({ email, username, phoneNumber });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      res.locals.currUser = req.user;
      res.redirect("/quizApplication/home");
    });
  } catch (error) {
    console.log(error);
    res.send("Error Occurred");
  }
});

//Sign In Authentication

app.post('/quizApplication/signIn',
  passport.authenticate("local", { failureRedirect: "/signIn" }),
  async (req, res) => {
    res.locals.currUser = req.user;
    res.redirect("/quizApplication/home");
  }
);

//Sign Out Authentication

app.get("/quizApplication/signOut", async (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
    }
    res.locals.currUser = undefined;
    res.redirect("/quizApplication/home");
  })
});

main().then((res) => {
    console.log("connection successfully");
  }).catch((err) => console.log(err));
  
  
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/QuizApplication');
  }
  app.get('/quizApplication/question/:id', async (req, res) => {
      const id = parseInt(req.params.id);;
    const questions = await Question.find();
   
    if (id >= 0 && id < questions.length) {
      res.json({ question: questions[id],total:questions.length });
  } else {
      res.status(404).json({ message: 'No more questions' });
  }
});
// All User Queries 

app.post("/quizApplication/userQuery", async (req, res) => {
  try {
    let { username, email, subject, message } = req.body;
    let newQuery = new newUserQuery({ username, email, subject, message });
    await newQuery.save();
    const allQueries = await newUserQuery.find();
    res.render("query.ejs", { newQueries: allQueries });
  } catch (error) {
    console.log(error);
    res.send("Error Occurred");
  }

});
// Home Page Route
  app.get('/quizApplication/home',(req,res)=>{
    res.render("home.ejs");
  });
  // Quiz Route
  app.get('/quizApplication/quiz',async(req,res)=>{
   
    res.render("quiz.ejs");
    
  });
  //Contact Page Route
app.get("/quizApplication/contact", (req, res) => {
  res.render("contact.ejs");
});
app.get("/quizApplication/score" ,(req,res)=>{
res.render("score.ejs")
});
  app.listen(port, () => {
    console.log("server is listening to port="+port);
  });