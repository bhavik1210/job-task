const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/db.js');
const cookieParser = require("cookie-parser");
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dwsb3pmxs',  // replace with your Cloudinary cloud name
  api_key: '313339969372339',        // replace with your Cloudinary API key
  api_secret: 'odDYYUeLVENsGza_Kld1jQ0NEW4',   // replace with your Cloudinary API secret
});

dotenv.config();
connectDB();

const app = express();

// Enable file uploads


app.use(cookieParser());
app.use(express.json()); 


app.use(
  cors({
    origin: "https://job-task-frontend-theta.vercel.app",  
    credentials: true,                
  })
);

app.use(fileUpload());


// Routes
const user = require("./controller/user.js");
const jobs = require("./controller/job.js");
const application = require("./controller/applicant.js");




app.use("/api/user", user);
app.use("/api/jobs", jobs);
app.use("/api/application", application);





const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
