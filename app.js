//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
// SETTING THE PUBLIC STATIC FILES....
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// CONNECTING TO MONGODB DATABASE
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});
// CREATING THE SCHEMA
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
// THE ENCRYPTING PROCESS ...................
// const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

// NEW MODEL THIS CREATES THE COLLECTION IN THE DATABASE
const user = new mongoose.model("User", userSchema);
// RENDERING THE HOME PAGE
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
// CATCHING THE DATA PLACED IN THE REGISTER PAGE
app.post("/register", function (req, res) {
  const newUser = new user({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
// HANDLING THE LOGIN PAGE
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  // CHECKING IF THE DETAILS ARE IN THE DATABASE
  user.findOne(
    {
      email: username,
    },
    function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    }
  );
});

// SETTING THE SERVER
app.listen(3000, function () {
  console.log("SERVER IS UP AND RUNNING BOSS");
});
