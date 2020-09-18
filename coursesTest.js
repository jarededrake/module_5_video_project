const mongoose = require("mongoose");
const Course = require("./models/courses");
mongoose.connect("mongodb://localhost/courses_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

Course.create({
    title: "test 1",
    description: "test 1",
    imageURL: "test 1",
    isPublic: "test 1",
    createdAt: "test 1",
}), (error, course) => {
    console.log(error, course)
}