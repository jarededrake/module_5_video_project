/*
TO DOS:
-> Figure out why mongoDB is allowing more than one of the same user name
-> Once we figure out the above, when an error is through re route them back to register 
-> Prevent login/register if logged in

-> Display the courses the user is registered for 
-> Display the user name in nav bar
-> Make pictures fit properly in div on user home page
-> Fix course details page
-> Check to see if there are courses, if there are display courses, if not display "no courses"
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
})

app.set("view engine", "ejs")
app.use(express.static("static"))

app.listen(3000, () => {
    console.log("app listening on port 3000")
})
app.get("/", async (req, res) => {
    if(req.session.userId) {
    const courses = await Courses.find({});
    console.log(req.session.userId)
    res.render("user-home", {
        courses
    });
    } else {
        res.redirect("guest-home")
    }
})
app.get("/guest-home", (req, res) => {
    res.render("guest-home")
})
app.get("/course-details", (req, res) => {
    res.render("course-details")
})
app.get('/course-details/:id',async (req,res)=>{        
    const courseDetails = await Courses.findById(req.params.id)
    res.render('course-details',{
        courseDetails
    });    
})

app.get("/create-course", (req, res) => {
    if(req.session.userId) {
        return res.render("create-course") //need to look back at implementing this, if there is no user id then they cannot create a post
    }
    res.render("create-course")
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
            image:"/img/" + image.name
            })
        res.redirect("/")
    })
})
app.post("/users/register", (req, res) => {
    Users.create(req.body, (error, user) => {
        console.log(error);
        if(error) {
            return res.redirect("/users/register")
        }
        res.redirect("/");
    })
})
app.post("/users/login", (req, res) => {
    const {username, password} = req.body;

    Users.findOne({username:username}, (error,user) => {
        if(user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if(same) {
                    req.session.userId = user._id
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




