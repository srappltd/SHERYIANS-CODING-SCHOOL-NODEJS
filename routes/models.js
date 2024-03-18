const mongoose = require("mongoose")

const dateFind = new Date()
let day = dateFind.getDate()
let month = dateFind.getMonth()
let year = dateFind.getFullYear()
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const date = `${monthNames[month]} ${day} ${year}`
const time = dateFind.toLocaleTimeString()
console.log({date,time})

// user Model
const userSchema = new mongoose.Schema({
    picture:{type:String,default:""},
    username:{type:String,required:true},
    email:{type:String,required:true,lowercase:true},
    password:{type:String,required:true},
    mobile:{type:String,default:""},
    occapation:{type:String,default:""},
    date:{type:String,default:date},
    time:{type:String,default:time},
    address:{type:String,default:""},
    theme:{type:Number,default:1},
    mac:{type:String,default:""},
    verfiy:{type:Boolean,default:false},
    feedback:[{type:mongoose.Schema.Types.ObjectId,ref:"feedbacks"}],
    courseid:[{type:mongoose.Schema.Types.ObjectId,ref:"courses"}],
},{versionKey:false,timestamps:true})
const userModel = mongoose.model("users",userSchema)

// admin Model
const adminSchema = new mongoose.Schema({
    picture:{type:String,default:""},
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    date:{type:String,default:date},
    time:{type:String,default:time},
    mac:{type:String,default:""},
},{versionKey:false,timestamps:true})
const adminModel = mongoose.model("admin",adminSchema)

// upload Model
const lessonSchema = new mongoose.Schema({
    lesson:{type:String,required:true},
    heading:{type:String,required:true},
    des:{type:String,required:true},
    date:{type:String,default:date},
    time:{type:String,default:time},
    mac:{type:String,required:true},
    mentorid:{type:mongoose.Schema.Types.ObjectId,ref:"mentors"},
    courseid:{type:mongoose.Schema.Types.ObjectId,ref:"courses"},
    adminid:{type:mongoose.Schema.Types.ObjectId,ref:"admins"},
},{versionKey:false,timestamps:true})
const lessonModel = mongoose.model("lessons",lessonSchema)
// upload Model
const uploadSchema = new mongoose.Schema({
    poster:String,
    url:{type:String,required:true},
    title:{type:String,required:true},
    des:{type:String,required:true},
    duration:{type:String,default:""},
    date:{type:String,default:date},
    views:{type:Number,default:0},
    time:{type:String,default:time},
    mac:{type:String,default:""},
    mentorid:{type:mongoose.Schema.Types.ObjectId,ref:"mentors"},
    courseid:{type:mongoose.Schema.Types.ObjectId,ref:"courses"},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    dislikes:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    comment:[{type:mongoose.Schema.Types.ObjectId,ref:"comments"}],
    share:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    adminid:{type:mongoose.Schema.Types.ObjectId,ref:"admins"},
},{versionKey:false,timestamps:true})
const uploadModel = mongoose.model("uploads",uploadSchema)

// course model
const courseSchema = new mongoose.Schema({
    poster:String,
    title:String,
    date:{type:String,default:date},
    time:{type:String,default:time},
    des:{type:String,required:true},
    start:{type:String,required:true},
    end:{type:String,required:true},
    duration:{type:String,default:""},
    mentorid:{type:mongoose.Schema.Types.ObjectId,ref:"mentors"},
    postid:[{type:mongoose.Schema.Types.ObjectId,ref:"uploads"}],
    lessonid:[{type:mongoose.Schema.Types.ObjectId,ref:"lessons"}],
    comment:[{type:mongoose.Schema.Types.ObjectId,ref:"comments"}],
    fee:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    adminid:{type:mongoose.Schema.Types.ObjectId,ref:"admin"},
},{versionKey:false,timestamps:true})
const courseModel = mongoose.model("courses",courseSchema)

// mentor model
const mentorSchema = new mongoose.Schema({
    picture:{type:String,required:true},
    email:{type:String,required:true},
    username:{type:String,required:true},
    des:{type:String,required:true},
    skill:{type:String,required:true},
    date:{type:String,default:date},
    time:{type:String,default:time},
    adminid:{type:mongoose.Schema.Types.ObjectId,ref:"admins"},
    courseid:[{type:mongoose.Schema.Types.ObjectId,ref:"courses"}],
    postid:[{type:mongoose.Schema.Types.ObjectId,ref:"uploads"}],
},{versionKey:false,timestamps:true})
const mentorModel = mongoose.model("mentors",mentorSchema)

// comments 
const commentSchema = new mongoose.Schema({
    comment:String,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    videoid:{type:mongoose.Schema.Types.ObjectId,ref:"uploads"},
    date:{type:String,default:date},
    time:{type:String,default:time},
})
const commentModel = mongoose.model("comments",commentSchema)

// help 
const contactSchema = new mongoose.Schema({
    name:{type:String,required:true},
    enquiry:{type:String,required:true},
    mobile:{type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true},
    date:{type:String,default:date},
    time:{type:String,default:time},
},{versionKey:false,timestamps:true})
const contactModel = mongoose.model("helps",contactSchema)


module.exports = {userModel,uploadModel,courseModel,mentorModel,mentorModel,adminModel,lessonModel,commentModel,contactModel}