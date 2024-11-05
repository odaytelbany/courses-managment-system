require("dotenv").config();
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const coursesRouter = require("./routes/courses.route");
const userRouter = require("./routes/users.route");
const httpStatusText = require("./utils/httpStatusText");
const cors = require('cors');

const app = express();

// Connect to db using mongoose
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
  console.log("MongoDB connected successfully !");
});

// cors policy
app.use(cors());
//Middleware for post request
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routers
app.use("/api/courses", coursesRouter);
app.use("/api/users", userRouter);

// global middleware for not found routes
app.all("*", (req, res) => {
  res.status(404).json({ status: httpStatusText.ERROR, data: null, message: "This resource is not avilable" });
});


// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message || "Error"})
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listening on port, ", port);
});
