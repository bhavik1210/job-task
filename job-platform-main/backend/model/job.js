const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
   
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String], // array of strings
      required: true,
    },
    postedDate: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
