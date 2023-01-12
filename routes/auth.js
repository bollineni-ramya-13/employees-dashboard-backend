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
    const {name,dob,email,number,gender,teamType,location,password} = req.body
    if(!name || !dob ||!email || !number || !gender || !teamType || !location || !password  ){
       return  res.status(422).json({error:"please add all the fields",status:422})
    }
    // console.log(req.body)
    // res.json({message:"Successfully posted"})
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email",status:422})
        }
            bcrypt.hash(password,12)
            .then(hashedPassword=>{
                const user =  new User({
                    name,
                    dob,
                    email,
                    number,
                    gender,
                    teamType,
                    location,
                    password:hashedPassword
                })
    
                user.save()
                .then(user=>{
                    res.json({message:"Registration successfull",status:200})
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
        res.status(422).json({error:"Please add email or password",status:422})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password",status:422})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
                let user = {name:savedUser.name,email:savedUser.email,pic:savedUser.pic}
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token,user,status:200})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password",status:422})
            }
        })
        .catch(err=>{
            console.log(err);
        })

    })
})

router.get('/profile',requireLogin,(req,res)=>{
   
    User.findOne({email:req.user.email})
    .then(user=>{
        let userDetails = {
            name:user.name,
            dob:user.dob,
            email:user.email,
            number:user.number,
            gender:user.gender,
            teamType:user.teamType,
            location:user.location,
            pic:user.pic
        }
        return res.json({userDetails,status:200})
    })
    .catch(err=>{
        console.log(err);
    })

})

router.get('/allemployees',(req,res)=>{
    User.find({},{name:1,email:1,teamType:1,dob:1,pic:1})
    .then(employees=>{
        res.json({employees,status:200})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/selected',(req,res)=>{
    const {teamType} = req.body
    User.find({teamType:teamType},{name:1,email:1,teamType:1,dob:1,pic:1})
    .then(employees=>{
        res.json({employees,status:200})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put("/updatepic",requireLogin,(req,res)=>{
    console.log("req user",req.user,"req body",req.body);

    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:"pic cannot post"})
        }
        let userDetails = {
            name:result.name,
            dob:result.dob,
            email:result.email,
            number:result.number,
            gender:result.gender,
            teamType:result.teamType,
            location:result.location,
            pic:result.pic
        }
        res.json(userDetails)
    })
})

module.exports = router