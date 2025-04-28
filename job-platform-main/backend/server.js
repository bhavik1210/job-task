const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/db.js');
const cookieParser = require("cookie-parser");
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

dotenv.config();
connectDB();

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dwsb3pmxs',
  api_key: '313339969372339',
  api_secret: 'odDYYUeLVENsGza_Kld1jQ0NEW4',
});

// CORS should come FIRST
app.use(cors({
  origin: "https://job-task-frontend-theta.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Other middlewares
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());

// Routes
const user = require("./controller/user.js");
const jobs = require("./controller/job.js");
const application = require("./controller/applicant.js");

app.use("/api/user", user);
app.use("/api/jobs", jobs);
app.use("/api/application", application);

// Server listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
