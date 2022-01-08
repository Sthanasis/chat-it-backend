const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 4,
  },
  firstname: { type: String, required: [true, "Please provide a firstname!"] },
  gender: { type: String, required: [true, "Please provide a gender!"] },
  lastname: { type: String, required: [true, "Please provide a lastname!"] },
  dateOfBirth: {
    type: String,
    required: [true, "Please provide your date of birth!"],
  },
  email: { type: String, required: [true, "Please provide an email!"] },
  uid: { type: String },
  active: { type: Boolean },
  connectedTo: [String],
  pendingConnections: [String],
  images: [String],
  imageUrl: { type: String },
  location: { type: String },
  hobbies: [String],
  about: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
