//jshint esversion:6
require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;


const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:String
});

//userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]}); 

const User =new  mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});


app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password,saltRounds, function(err, hash) {
        const newUser = new User({
            email:req.body.username,
            password:hash
        }); 
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }
        else {
            console.log("New User Added Successfully");
            res.render("secrets");
        }
    });
   });
});

app.post("/login",(req,res)=>{
    const userName=req.body.username;
    const password=req.body.password;
    User.findOne({email:userName},(err,foundUser)=>{
        if(err){
            console.log(err);
        }
        else if(foundUser){
            console.log("User Found");
            bcrypt.compare(password,foundUser.password).then(function(result) {
                if(result===true)
                res.render("secrets");
                else console.log("Wrong Password"); 
            });
        }
        else console.log("Invalid Credentials");
    });
});






app.listen(3000,()=>{
    console.log("Server started on port 3000");
});