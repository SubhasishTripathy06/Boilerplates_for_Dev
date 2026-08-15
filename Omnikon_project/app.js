const { urlencoded } = require('body-parser');
const express=require('express')
const app=express();
const userModel=require('./models/user.js')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')

// parsers

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');


// establishing routes
app.get('/',(req,res)=>{
    res.render("index.ejs");
})
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})
app.post('/create',async (req,res)=>{
    let {name,email,password}=req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {
            let createduser=await userModel.create({
                name,
                email,
                password:hash
            })
        });
    });
    res.redirect('/login');
})
app.get('/login',(req,res)=>{
    res.render('login.ejs');
})
app.post('/check',async (req,res)=>{
    let {email,password}=req.body;
    let user=await userModel.findOne({email});
    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            let cookie=jwt.sign({email:email,password:password},'SHH');
            res.cookie("token",cookie);
            res.redirect('/profile');
        } 
        else {
            res.redirect('/login');
        }
    });
})
app.get('/profile',(req,res)=>{
    res.render('profile.ejs');
})
app.listen(3000);

// we still haven't made the middle ware to check is loggedin or not
// we will do that in a while