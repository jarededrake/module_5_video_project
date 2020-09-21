const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")
const currentEnrolledCourses = require("./courses")

const UsersSchema = new Schema ({
     username: {
        type: String,
        required: true,
        useCreateIndex: true,
        autoIndex: true,
     },
     password: {
         type: String,
         required: true,
     }
 });

 UsersSchema.pre("save", function(next) {
     const user = this

     bcrypt.hash(user.password, 10, (error, hash) => {
         user.password = hash;
         next();
     })
 })

 const Users = mongoose.model("Users", UsersSchema);
 module.exports = Users;