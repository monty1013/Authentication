//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const { render } = require("ejs");
const { Passport } = require('passport');
const app = express();


app.set('view engine' , 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'This is my secret key',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/UsersDB" , {useNewUrlParser:true});
mongoose.set("useCreateIndex" , true);

const UserSchema = new mongoose.Schema({
    email : String ,
    password : String
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User" , UserSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/" , function(req,res){
    res.render('home');
});



app.get("/login" , function(req,res){
    res.render('login');
});

app.get("/register" , function(req,res){
    res.render('register');
});

app.get("/secrets" , (req,res) => {
    if(req.isAuthenticated())
    {
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

app.get("/logout" , (req,res) => {
    req.logOut();
    res.redirect("/"); 
})

app.post("/register" , (req,res) => {
    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res , function(){
                res.redirect("/secrets");
            });
        }
    });
    
});

app.post("/login" ,(req,res) => {
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });
    req.logIn(user , function(err){
        if(err)
        {
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });
});

app.listen(3000 , () => {
    console.log("Server Started at 3000");
});
