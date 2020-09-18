const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema ({
     title: String,
     description: String,
     imageURL: String,
     isPublic: false,
     createdAt: String,
 })

 const Courses = mongoose.model("Courses", CourseSchema);
 module.exports = Courses;