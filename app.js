//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const { render } = require("ejs");
const app = express();

app.set('view engine' , 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/UsersDB" , {useNewUrlParser:true});

const UserSchema = new mongoose.Schema({
    email : String ,
    password : String
});


const User = mongoose.model("User" , UserSchema);

app.get("/" , function(req,res){
    res.render('home');
});



app.get("/login" , function(req,res){
    res.render('login');
});

app.get("/register" , function(req,res){
    res.render('register');
});

app.post("/register" , (req,res) => {
    const newUser = new User({
        email : req.body.username,
        password : md5(req.body.password)
    });
    newUser.save();

    res.render('secrets');
});

app.post("/login" ,(req,res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email : username} , (err,foundData)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundData)
            {
                if(foundData.password == password)
                {
                    console.log(foundData.password);
                    res.render('secrets');
                }
                else{
                    res.send("GUilty");
                }
            }
        }
    });
});

app.listen(3000 , () => {
    console.log("Server Started at 3000");
});
