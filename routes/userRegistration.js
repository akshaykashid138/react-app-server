const express=require('express')
const User=require('../models/userRegistration')
const bcrypt=require('bcrypt')
const dotenv=require('dotenv')
const nodemailer =require('nodemailer')
const Mail = require('nodemailer/lib/mailer');

dotenv.config()
const router=express.Router()

router.get('/',async (req,res)=>{
    let users=await User.find()
    res.send(users)
})

//user Registration
router.post('/registration',async (req,res)=>{
    let user= await User.findOne({email:req.body.email})
    
    if(user) return res.status(200).json({message:"user already registered!"})
    
    let newUser = await User(req.body)
    
    const salt= await bcrypt.genSalt(10)
    const hashed=await bcrypt.hash(req.body.password,salt)
    newUser.password=hashed
     newUser.save()
    res.status(200).json({success:"user created successfully"})
    {
        await registrationMail(req.body.email)
         res.sendStatus(201);
    }
})

//user login
router.post('/login',async (req,res)=>{
    try{
        let user= await User.findOne({email:req.body.email})
    
    if(user){
        let isPasswordMatched = await bcrypt.compare(req.body.password, user.password)
        console.log(isPasswordMatched)
        if (!isPasswordMatched){
            
            return res.status(200).json({message: "Invalid Email or Password"})
        }
        else {
            res.status(200).json({success:"Login Sucessfull"})
            await loggedInMail(user.email)
        }
    }else{
        return  res.status(200).json({message:"Invalid Email or Password"})
    }  
    }catch(error){
        console.log(error)
    }
     
})


//login mail
async function loggedInMail(email) {
    // console.log(name)
    let transporter = nodemailer.createTransport({
       host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "welcome ", // Subject line
        text: "Hello ", // plain text body
        html: " Thank you! you are logged in.", // html body
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Mailed!!");
        }
    });

}

//registering mail
async function registrationMail(email) {
    // console.log(name)
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "welcome ", // Subject line
        text: "Hello ", // plain text body
        html: " Thank you! For registering with us.", // html body
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Mailed!!");
        }
    });

}
module.exports=router