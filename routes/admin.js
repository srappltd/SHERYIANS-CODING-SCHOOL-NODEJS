var express = require('express');
const bcrypt = require("bcrypt")
const { getVideoDurationInSeconds } = require('get-video-duration');
const os = require('os');
var router = express.Router();
const {adminLogin,adminLogout} = require("./middleware")
const {courseModel,mentorModel,uploadModel,userModel,adminModel,lessonModel} = require("./models")
const {courseMulter,mentorMulter,uploadMulter,userMulter} = require("./multer")

let mac = os.networkInterfaces()

// second duration time formate change
const formates = (second) => (new Date(second* 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
const d = formates(200)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("admin/admin-login");
});
// router.get('/signup', function(req, res, next) {
//   res.render("admin/admin-signup");
// });
router.get('/deshboard',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const users = await userModel.find();
    const mentors = await mentorModel.find();
    const videos = await uploadModel.find();
    const courses = await courseModel.find();
    res.render("admin/deshboard",{admin,users,mentors,videos,courses});
  }
});
router.get('/users',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const users = await userModel.find()
    res.render("admin/users",{admin,users});
  }
});
router.get('/courses',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const courses = await courseModel.find();
    res.render("admin/course",{admin,courses});
  }
});
router.get('/mentors',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const mentors = await mentorModel.find()
    res.render("admin/mentor",{admin,mentors});
  }
});
router.get('/uploads',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const uploads = await uploadModel.find().populate("courseid").populate("mentorid")
    res.render("admin/upload",{admin,uploads});
  }
});
router.get('/add-upload',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const courses = await courseModel.find()
    res.render("admin/add-upload",{admin,courses});
  }
});
router.post('/add-upload',adminLogout,uploadMulter.fields([{name:"poster"},{name:"video"}]),async function(req, res, next) {
  if(req.session.admin){
    const {title,des,courseid} = req.body
    const admin = await adminModel.findById(req.session.admin._id)
    const courseFind = await courseModel.findById(courseid)
    const mentorFind = await mentorModel.findById(courseFind.mentorid)
    const upload = await uploadModel.create({title,des,poster:req.files["poster"][0].filename,url:req.files["video"][0].filename,courseid,mentorid:courseFind.mentorid,adminid:admin._id})
    let duration = await getVideoDurationInSeconds(`public/admin/uploads/${upload.url}`);
    upload.duration = (formates(duration))
    courseFind.postid.push(upload._id)
    mentorFind.postid.push(upload._id)
    await upload.save();
    await courseFind.save();
    await mentorFind.save();
    res.redirect('/admin/uploads');
  }
});
router.get("/video-delete",adminLogout,async (req,res)=>{
  if(req.session.admin){
    const video = await uploadModel.findById(req.query.video);
    const mentorid = await mentorModel.findById(video.mentorid)
    const courseid = await courseModel.findById(video.courseid)
    await uploadModel.deleteOne({_id:req.query.video})
    mentorid.postid.splice(video._id,1)
    courseid.postid.splice(video._id,1)
    await mentorid.save();
    await courseid.save();
    res.redirect("back")
  }
})

// lesson
router.get('/lessons',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const lessons = await lessonModel.find({courseid:req.query.courseid})
    res.render("admin/lesson",{admin,lessons,courseid:req.query.courseid});
  }
});
router.get('/add-lesson',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    res.render("admin/add-lesson",{admin,courseid:req.query.courseid});
  }
});
router.post('/add-lesson/:courseid',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const {lesson,des,heading} = req.body
    const admin = await adminModel.findById(req.session.admin._id)
    const courseFind = await courseModel.findById(req.params.courseid)
    const lessonData = await lessonModel.create({lesson,des,heading,courseid:courseFind._id,mentorid:courseFind.mentorid,adminid:admin._id,mac:mac['Wi-Fi'][0].mac})
    courseFind.lessonid.push(lessonData._id)
    await courseFind.save()
    res.redirect(`/admin/lessons?courseid=${req.params.courseid}`)
  }
});
router.get("/lesson-delete",adminLogout,async (req,res)=>{
  if(req.session.admin){
    const lesson = await lessonModel.findById(req.query.lesson)
    const courseid = await courseModel.findById(lesson.courseid)
    await lessonModel.deleteOne({_id:req.query.lesson})
    courseid.lessonid.splice(lesson._id,1)
    await courseid.save();
    res.redirect("back")
  }
})

// mentor 
router.get('/add-mentor',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    res.render("admin/add-mentor",{admin});
  }
});
router.post("/add-mentor",adminLogout,mentorMulter.single("picture"),async (req,res)=>{
  if(req.session.admin){
    const {username,email,des,skill} = req.body
    if(username && email && des && skill){
      const admin = await adminModel.findById(req.session.admin._id)
      const mentor = await mentorModel.create({username,email,des,skill,picture:req.file.filename,adminid:admin._id})
      res.redirect("/admin/mentors")
    }
  }
})

// course
router.get('/add-course',adminLogout,async function(req, res, next) {
  if(req.session.admin){
    const admin = await adminModel.findById(req.session.admin._id)
    const mentors = await mentorModel.find();
    res.render("admin/add-course",{admin,mentors});
  }
});
router.post("/add-course",adminLogout,courseMulter.single("poster"),async (req,res)=>{
  if(req.session.admin){
    const {title,mentorid,des,duration,startdate,enddate} = req.body
    if(title && mentorid && des && duration && startdate && enddate){
      const admin = await adminModel.findById(req.session.admin._id)
      const mentor = await mentorModel.findById(mentorid)
      const course = await courseModel.create({title,des,mentorid,start:startdate,end:enddate,poster:req.file.filename,duration,adminid:admin._id})
      mentor.courseid.push(course._id)
      await mentor.save()
      res.redirect("/admin/courses")
    }else{
      res.redirect("/admin/add-course")
    }
  }
})
router.get("/course-delete",adminLogout,async (req,res)=>{
  if(req.session.admin){
    const course = await courseModel.findById(req.query.course)
    const mentorid = await mentorModel.findById(course.mentorid)
    await courseModel.deleteOne({_id:req.query.course})
    mentorid.courseid.splice(course._id)
    await mentorid.save()
    res.redirect("back")
  }
})

async function adminUserCreate(){
  const adminFind = await adminModel.findOne({email:process.env.EMAIL})
  if(!adminFind){
    const passHash = await bcrypt.hash(process.env.PASSWORD,10)
    return await adminModel.create({username:process.env.USERNAME,email:process.env.EMAIL,password:passHash})
  }
}
adminUserCreate()

// router.post("/signup",adminLogin,async (req,res)=>{
//   const {username,email,password} = req.body
//   const adminFind = await adminModel.findOne({email})
//   if(username && email && password){
//     if(!adminFind){
//       const passHash = await bcrypt.hash(password,10)
//       const adminData = await adminModel.create({username,email,password:passHash})
//       req.session.admin = adminData
//       res.redirect("/admin/deshboard")
//     }else{
//       res.send({alert:"User allready register"})
//     }
//   }else{
//     res.send({alert:"Allfield required"})
//   }
// })

router.post("/signin",adminLogin,async (req,res)=>{
  const {email,password} = req.body
  const adminFind = await adminModel.findOne({email})
  if(email && password){
    if(adminFind){
      const passHash = await bcrypt.compare(password,adminFind.password)
      if(email == adminFind.email && passHash){
        req.session.admin = adminFind
        res.redirect("/admin/deshboard")
      }
    }else{
      res.send({alert:"User not registered"})
    }
  }else{
    res.send({alert:"All fields required"})
  }
})

router.get("/logout",(req,res)=>{
  if(req.session.admin){
    req.session.destroy((err)=>{
      if(err){
        res.redirect("/admin")
      }else{
        res.redirect("/admin")
      }
    })
  }
})



module.exports = router;
