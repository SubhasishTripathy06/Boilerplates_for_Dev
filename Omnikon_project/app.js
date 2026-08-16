const { urlencoded } = require('body-parser');
const express=require('express')
const app=express();
const userModel=require('./models/user.js')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const auth= require('./services/auth.js');
const cookieParser = require('cookie-parser');
// almost forgot the cookie-parser


// parsers
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(cookieParser());


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
            let cookie=auth.setuser(user);
            res.cookie("token",cookie);
            res.redirect('/profile');
        } 
        else {
            res.redirect('/login');
        }
    });
})
app.get('/profile',isloggedin,(req,res)=>{
    res.render('profile.ejs');
})
app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect("/login");
})

function isloggedin(req, res, next) {
    const token = req.cookies.token;

    if (!token || (token==="")) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    const decoded = auth.getuser(token);

    if (!decoded) {
        return res.status(403).json({
            message: "Invalid or expired token."
        });
    }

    req.user = decoded;
    next();
}

app.listen(3000);
