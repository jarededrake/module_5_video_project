/*
TO DOS:
-> Link user id and courses they created so it only shows the courses of the person logged in
-> Make pictures fit properly in div on user home page
-> Fix course details page
-> Check to see if there are courses, if there are display courses, if not display "no courses"
-> Delete course
-> Edit course
-> Better way to display notifications?
-> Validate passwords
*/

const express = require("express");
const app = new express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Courses = require("./models/courses");
const Users = require("./models/users");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");
const expressionSession = require("express-session");
const authMiddleware = require("./middlweare/authMiddleware")
const logoutController = require("./controllers/logout")


app.use(expressionSession({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
}))
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost/courses_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
})

app.set("view engine", "ejs")
app.use(express.static("public"))

app.listen(3000, () => {
    console.log("app listening on port 3000")
})
app.get("/", async (req, res) => {
    if(req.session.user) {
    const id = req.session.user._id
    const courses = await Courses.find({creatorID: id}).lean()
    console.log(courses)
    res.render("user-home", {
        courses,
        username: req.session.user.username,
    });
    
    } else {
        res.redirect("guest-home")
    }
})
app.get("/guest-home", (req, res) => {
    res.render("guest-home")
})
app.get("/course-details", (req, res) => {
    if(req.secret.user) {
    res.render("course-details")
    } else {
        res.redirect("guest-home")
    }
})
app.get('/course-details/:id',async (req,res)=>{ 
    if(req.session.user) {       
    const courseDetails = await Courses.findById(req.params.id)
    res.render('course-details',{
        courseDetails,
        username: req.session.user.username,
    });    
    } else {
        res.redirect("guest-home")
    }
})

app.get("/create-course", (req, res) => {
   if(req.session.user) {
       res.render("create-course", {
        username: req.session.user.username,
       })
   } else {
       res.redirect("guest-home")
   }
})

app.get("/edit-course", (req, res) => {
    res.render("edit-course")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/posts/store", async (req, res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname, "public/img", image.name), async (error) => {
        await Courses.create({
            ...req.body,
            image:"/img/" + image.name,
            creatorID: req.session.user._id,
            })
        res.redirect("/")
    })
})
app.post("/users/register", (req, res) => {
    Users.create(req.body, (error, user) => {
        if(error) {
            return res.redirect("/guest-home")
        } else {
        res.redirect("/login");
        }
    })
})
app.post("/users/login", (req, res) => {
    const {username, password} = req.body;
    Users.findOne({username:username}, (error,user) => {
        if(user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if(same) {
                    req.session.user = user
                    res.redirect("/")
                }
                else {
                    res.redirect("/login")
                }
            })
        }
        else {
            res.redirect("/login")
        }
    })
})

app.get("/auth/logout", logoutController);
app.use((req, res) => res.render("notfound"));



// const createCourseController = require("./controllers/createCourse")
// const userHomeController = require("./controllers/userHome")
// const courseDetailsController = require("./controllers/courseDetails")
// app.get("/", userHomeController);
// app.get("/course-details", courseDetailsController);
// app.get("/create-course", createCourseController);

// const user = await Users.find({username: req.session.user.username})
    // const courses = await Courses.find({_id: {$in: user.courses}});
    // console.log(courses)
    // console.log(user)
    // console.log(req.session.userId)



