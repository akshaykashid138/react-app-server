const express=require('express')
const User=require('../models/userRegistration')
const bcrypt=require('bcrypt')
const transporter=require('../lib/mailer')

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
        console.log("executed")
        var mailOptions = {
                                from: 'eduforumdevs@gmail.com',
                                to: req.body.email,
                                subject: 'Registration Mail',
                                text: 'Registered successfully'
                          };

                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                    });
         res.sendStatus(201);
    }
})

//user login
router.post('/login',async (req,res)=>{
    let user= await User.findOne({email:req.body.email})
    
    if(user){
        let isPasswordMatched = await bcrypt.compare(req.body.password, user.password)
        console.log(isPasswordMatched)
        if (!isPasswordMatched){
            
            return res.status(200).json({message: "Invalid Email or Password"})
        }
        else {
            res.status(200).json({success:"Login Sucessfull"})
            {
                
                var mailOptions = {
                                        from: 'eduforumdevs@gmail.com',
                                        to: user.email,
                                        subject: 'Login Mail',
                                        text: 'You are logged in'
                                  };
        
                            transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log("error....",error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                            });
                 res.sendStatus(201);
            }
        }
    }else{
        return  res.status(200).json({message:"Invalid Email or Password"})
    }   
})

module.exports=router