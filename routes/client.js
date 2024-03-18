var express = require("express");
const bcrypt = require("bcrypt");
const os = require("os");
const fs = require("fs");
var router = express.Router();
const { clientLogin, clientLogout } = require("./middleware");
const {
  userModel,
  uploadModel,
  courseModel,
  commentModel,
  contactModel,
} = require("./models");
const { userMulter } = require("./multer");

let mac = os.networkInterfaces();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const courses = await courseModel.find();
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      res.render("client/index", { user, courses });
    } else {
      res.render("client/index", { user: false, courses });
    }
    
  } catch (error) {
    res.send(error)
  }
});
router.get("/signup", function (req, res, next) {
  try {
    debugger;
    res.render("client/signup");
  } catch (error) {
    res.send(error)
  }
});
router.get("/signin", function (req, res, next) {
  res.render("client/signin");
});
router.get("/courses", async function (req, res, next) {
  try {
    const courses = await courseModel.find();
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      res.render("client/courses", { user, courses });
    } else {
      res.render("client/courses", { user: false, courses });
    }
  } catch (error) {
    res.send(error)
  }
});
router.get("/campus-ambussador", async function (req, res, next) {
  try {
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      res.render("client/CampusAmbassador", { user });
    } else {
      res.render("client/CampusAmbassador", { user: false });
    }
    
  } catch (error) {
    res.send(error)
  }
});
router.get("/girls-who-code", async function (req, res, next) {
  try {
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      res.render("client/GirlsWhoCode", { user });
    } else {
      res.render("client/GirlsWhoCode", { user: false });
    }
    
  } catch (error) {
    res.send(error)
  }
});
router.get("/inertia", async function (req, res, next) {
  try {
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      res.render("client/inertia", { user });
    } else {
      res.render("client/inertia", { user: false });
    }
    
  } catch (error) {
    res.send(error)
  }
});

// class room page or my course
router.get("/classroom", clientLogout, async function (req, res, next) {
  try {
    if (req.session.user) {
      const user = await userModel
        .findById(req.session.user._id)
        .populate("courseid");
      console.log(user.courseid);
      console.log(user);
      res.render("client/classroom", { user });
    }
    
  } catch (error) {
    res.send(error)
  }
});

// got to claass room page
router.get(
  "/:userid/gotoclassroom/:courseid",
  clientLogout,
  async function (req, res, next) {
    try {
      if (req.session.user) {
        if (req.params.userid == req.session.user._id) {
          const user = await userModel.findById(req.session.user._id);
          const course = await courseModel
            .findById(req.params.courseid)
            .populate("mentorid")
            .populate("postid")
            .populate("adminid")
            .populate("likes");
  
          // user check course
          if (user.courseid.indexOf(course._id) != -1) {
            const open = await uploadModel.findById(course.postid[0]._id);
            if (course.postid.length != 0) {
              const video = await uploadModel.findById(req.query.v);
              const comment = await commentModel
                .find({ videoid: req.query.v })
                .populate("userid");
              const comment2 = await commentModel
                .find({ videoid: course.postid[0]._id })
                .populate("userid");
              const allUser = await userModel.find();
              if (req.query.v) {
                video.views++;
                await video.save();
              } else {
                open.views++;
                await open.save();
              }
              res.render("client/course-open-go", {
                user,
                course,
                video,
                comment,
                comment2,
                allUser,
              });
            } else {
              res.render("client/course-open-go", { user, course });
            }
          } else {
            res.render("client/course-open-go", { user, course });
          }
        } else {
          res.redirect(
            `/${req.params.userid}/gotoclassroom/${req.params.courseid}/error`
          );
        }
      }
    } catch (error) {
      res.send(error)
    }
  }
);
// course details page
router.get(
  "/course-details/:courseid",
  clientLogout,
  async function (req, res, next) {
    try {
      if (req.session.user) {
        const user = await userModel.findById(req.session.user._id);
        const allUser = await userModel.find();
        const courseFind = await courseModel
          .findById(req.params.courseid)
          .populate("mentorid")
          .populate("lessonid");
        return res.render("client/course-details", { user, courseFind, allUser });
      }
    
    } catch (error) {
      res.send(error)
    }
  }
);

// my account information profile
router.get("/my-account", clientLogout, async function (req, res, next) {
  if (req.session.user) {
    const user = await userModel.findById(req.session.user._id);
    return res.render("client/my-account", { user });
  }
});
// deshboard
router.get("/deshboard", clientLogout, async function (req, res, next) {
  if (req.session.user) {
    const user = await userModel.findById(req.session.user._id);
    res.render("client/deshboard", { user });
  }
});
// signup
router.post("/signup", clientLogin, async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;
    const userFind = await userModel.findOne({ email });
    if (username && email && mobile && password) {
      if (!userFind) {
        const passHash = await bcrypt.hash(password, 10);
        const userData = await userModel.create({
          username,
          email,
          mobile,
          password: passHash,
          mac: mac["Wi-Fi"][0].mac,
        });
        
        req.session.user = userData;
        res.redirect("/");
      } else {
        res.render("client/signup", { alert: "User allready register" });
      }
    } else {
      res.render("client/signup", { alert: "Allfield required" });
    }
    
  } catch (error) {
    res.send(error)
  }
});
// signin
router.post("/signin", clientLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFind = await userModel.findOne({ email });
    if (email && password) {
      if (userFind) {
        const passHash = await bcrypt.compare(password, userFind.password);
        if (email == userFind.email && passHash) {
          req.session.user = userFind;
          res.redirect("/");
        } else {
          res.render("client/signin", { alert: "Email & Password not match." });
        }
      } else {
        res.render("client/signin", { alert: "User not registered." });
      }
    } else {
      res.render("client/signin", { alert: "All fields required." });
    }
    
  } catch (error) {
    res.send(error)
  }
});
// logout
router.get("/logout", (req, res) => {
  try {
    if (req.session.user) {
      req.session.destroy((err) => {
        if (err) {
          res.redirect("/signin");
        } else {
          res.redirect("/signin");
        }
      });
    }
    
  } catch (error) {
    res.send(error)
  }
});

// profile picture change
router.post(
  "/pic-change",
  clientLogout,
  userMulter.single("picture"),
  async (req, res) => {
    try {
      
      if (req.session.user) {
        const user = await userModel.findById(req.session.user._id);
        fs.unlink(`public/admin/user-pic/${user.picture}`, async (err) => {
          if (!err) {
            user.picture = req.file.filename;
          } else {
            user.picture = req.file.filename;
          }
          await user.save();
          res.redirect("back");
        });
      }
    } catch (error) {
      res.send(error)
    }
  }
);

// buy
router.get("/buy", clientLogout, async (req, res) => {
  try {
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      const course = await courseModel.findById(req.query.courseid);
      if (user.courseid.indexOf(course._id) == -1) {
        user.courseid.push(course._id);
        course.fee.push(user._id);
      } else {
        user.courseid.splice(course._id, 1);
        course.fee.splice(user._id, 1);
      }
      await user.save();
      await course.save();
      res.redirect("/classroom");
    }
  } catch (error) {
    res.send(error)
  }
});

// comments
router.post("/comment/:v", clientLogout, async (req, res) => {
  try {
    if (req.session.user) {
      const userid = await userModel.findById(req.session.user._id);
      const videoid = await uploadModel.findById(req.params.v);
      const comment = await commentModel.create({
        comment: req.body.comment,
        videoid: videoid._id,
        userid: userid._id,
      });
      videoid.comment.push(comment._id);
      res.redirect("back");
  }
  } catch (error) {
    res.send(error)
  }
});

// like
router.get("/likes/:v", clientLogout, async (req, res) => {
  try {
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      const video = await uploadModel.findById(req.params.v);
      if (video.likes.indexOf(user._id) == -1) {
        video.likes.push(user._id);
        // like to dislike
        if (video.dislikes.indexOf(user._id) !== -1) {
          video.dislikes.splice(user._id, 1);
        }
      }
      await video.save();
      res.json(video);
    }
  } catch (error) {
    res.send(error)
  }
});
// dislike
router.get("/dislikes/:v", clientLogout, async (req, res) => {
  try {
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      const video = await uploadModel.findById(req.params.v);
      if (video.dislikes.indexOf(user._id) == -1) {
        video.dislikes.push(user._id);
        // dislike to like
        if (video.likes.indexOf(user._id) !== -1) {
          video.likes.splice(user._id, 1);
        }
      }
      await video.save();
      res.json(video);
    }
    
  } catch (error) {
    res.send(error)
  }
});

// theme change
router.get("/theme", clientLogout, async (req, res) => {
  try {
    if (req.session.user) {
      const userFind = await userModel.findById(req.session.user._id);
      if (userFind.theme == 1) {
        userFind.theme = 0;
      } else {
        userFind.theme = 1;
      }
      await userFind.save();
      res.redirect("back");
    }
    
  } catch (error) {
    res.send(error)
  }
});

router.get("/help", async (req, res) => {
  try {
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id);
      res.render("client/help", { user });
    } else {
      res.render("client/help", { user: false });
    }
    
  } catch (error) {
    res.send(error)
  }
});
router.post("/contact", async (req, res) => {
  
  try {
    const { name, mobile, email, message, enquiry } = req.body;
    if (name && mobile && email && message && enquiry) {
      await contactModel.create({ name, mobile, email, message, enquiry });
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
