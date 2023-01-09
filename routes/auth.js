const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/',(req,res)=>{
    res.send("Backend connected")
})

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!email || !password || !name){
       return  res.status(422).json({error:"please add all the fields"})
    }
    // res.json({message:"Successfully posted"})
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
        }
            bcrypt.hash(password,12)
            .then(hashedPassword=>{
                const user =  new User({
                    email,
                    name,
                    password:hashedPassword
                })
    
                user.save()
                .then(user=>{
                    res.json({message:"Registration successfull"})
                })
                .catch(error =>{
                    console.log(error);
                })
            })
    })
    .catch(err=>{
        console.log(err);
    })
    // console.log(req.body);
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
                let user = {name:savedUser.name,email:savedUser.email}
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token,user})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })

    })
})

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send("hello user")
// })

module.exports = router