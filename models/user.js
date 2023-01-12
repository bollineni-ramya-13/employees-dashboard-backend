const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    teamType:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dqlfjgkoe/image/upload/v1673422015/user_circle_icon_152504_sjztbt.png"
    },
    password:{
        type:String,
        required:true
    }
})

mongoose.model('User',userSchema)