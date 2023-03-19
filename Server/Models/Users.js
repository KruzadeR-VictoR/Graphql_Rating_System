const { isInteger } = require("lodash");
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: String,
  username: String,
  age: Number,
  ntl: String,
  photo: String,
});

module.exports = model("Users", userSchema);
