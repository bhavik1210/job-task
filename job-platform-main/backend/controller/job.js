const express = require("express");
const router = express.Router();
const Job = require("../model/job"); // adjust the path if needed
const auth = require("../middleware/auth");

// Create New Job
router.post("/create-new-job",auth ,async (req, res) => {

  try {
    const {
      
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      postedDate,
      category,
    } = req.body;

    // Basic validation (optional but recommended)
    if (
      !title ||
      !company ||
      !location ||
      !type ||
      !salary ||
      !description ||
      !requirements ||
      !postedDate ||
      !category
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new job instance
    const newJob = new Job({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      postedDate,
      category,
      userId: req.user.id, // Attach userId
    });

    // Save to database
    await newJob.save();

    return res.status(201).json({ message: "Job created successfully!", job: newJob });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


//get all jobs 

router.get("/get-all-jobs" ,async (req, res) => {
    try {
      const jobs = await Job.find(); // Fetch all jobs from the database
      return res.status(200).json({ jobs });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
});


//logged user all jobs 
router.get("/my-jobs", auth, async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from auth middleware
    const jobs = await Job.find({ userId }); // Filter jobs by userId
    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
