const multer = require("multer")
const path = require("path")
const {v4:uuid} = require("uuid")

// user multer
const userMulter = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'public/admin/user-pic')
        },
        filename:(req,file,cb)=>{
            cb(null,uuid()+path.extname(file.originalname))
        }
    }),
    limits:{fileSize:3*1024*1024},
    fileFilter:(req,file,cb)=>{
        let check = path.extname(file.originalname).toLowerCase()
        if(check == '.png' || check == '.jpg' || check == '.jpeg' || check == '.webp'){
            cb(null,true)
        }else{
            cb(new JSON({error:"File not Match..."}),false)
        }
    }
})
// mentor multer
const mentorMulter = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'public/admin/mentor-pic')
        },
        filename:(req,file,cb)=>{
            cb(null,uuid()+path.extname(file.originalname))
        }
    }),
    limits:{fileSize:3*1024*1024},
    fileFilter:(req,file,cb)=>{
        let check = path.extname(file.originalname).toLowerCase()
        if(check == '.png' || check == '.jpg' || check == '.jpeg' || check == '.webp'){
            cb(null,true)
        }else{
            cb(new JSON({error:"File not Match..."}),false)
        }
    }
})
// course multer
const courseMulter = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'public/admin/course-pic')
        },
        filename:(req,file,cb)=>{
            cb(null,uuid()+path.extname(file.originalname))
        }
    }),
    limits:{fileSize:3*1024*1024},
    fileFilter:(req,file,cb)=>{
        let check = path.extname(file.originalname).toLowerCase()
        if(check == '.png' || check == '.jpg' || check == '.jpeg' || check == '.webp'){
            cb(null,true)
        }else{
            cb(new JSON({error:"File not Match..."}),false)
        }
    }
})

//upload multer
const uploadMulter = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'public/admin/uploads')
        },
        filename:(req,file,cb)=>{
            cb(null,uuid()+path.extname(file.originalname))
        }
    }),
})

module.exports = {userMulter,uploadMulter,courseMulter,mentorMulter}
