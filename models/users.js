const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema ({
     username: String,
     password: String,
     //add enrolled courses
 })

 const Users = mongoose.model("UsersSchema", UsersSchema);
 module.exports = Users;