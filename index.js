const express = require("express");
const app = new express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Courses = require("./models/courses");
const Users = require("./models/users");
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost/courses_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// mongoose.createConnection("mongodb://localhost/users_database", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

app.set("view engine", "ejs")
app.use(express.static("static"))

app.listen(3000, () => {
    console.log("app listening on port 3000")
})
app.get("/", async (req, res) => {
    const courses = await Courses.find({});
    res.render("user-home", {
        courses
    });
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
        res.redirect("/");
    })
})



// const createCourseController = require("./controllers/createCourse")
// const userHomeController = require("./controllers/userHome")
// const courseDetailsController = require("./controllers/courseDetails")
// app.get("/", userHomeController);
// app.get("/course-details", courseDetailsController);
// app.get("/create-course", createCourseController);




