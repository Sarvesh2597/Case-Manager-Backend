const mongoose = require("mongoose");
const Schema = mongoose.Schema;
UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    unique: true,
    type: String,
    required: true
  },
  password: {
    unique: true,
    type: String,
    required: true
  }
});
module.exports = mongoose.model("User", UserSchema);
