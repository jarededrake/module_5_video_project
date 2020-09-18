const express = require("express");
const app = new express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Courses = require("./models/courses");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,}))

mongoose.connect("mongodb://localhost/courses_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.createConnection("mongodb://localhost/users_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.set("view engine", "ejs")
app.use(express.static("public"))

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
    await Courses.create(req.body);
        res.redirect("/");
})

