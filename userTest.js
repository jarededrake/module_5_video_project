const mongoose = require("mongoose");
const Course = require("./models/users");
mongoose.connect("mongodb://localhost/user_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

Course.create({
    username: "test 1",
    password: "test 1",
    //add enrolled courses
}), (error, course) => {
    console.log(error, course)
}