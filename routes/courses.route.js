const express = require("express");
const router = express.Router();
const validationSceama = require("../middlewares/validationSceama");
const verifyToken = require('../middlewares/verifyToken')
const userRoles = require('../utils/userRoles');
const {
  getCourses,
  getSingleCourse,
  addCourse,
  editCourse,
  deleteCourse,
} = require("../controllers/courses.controller");
const allowedTo = require("../middlewares/allowedTo");

// Route => '/'
router.route("/").get(getCourses).post(validationSceama(), addCourse);

// Route => '/:courseId'
router
  .route("/:courseId")
  .get(getSingleCourse)
  .patch(editCourse)
  .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), deleteCourse);

module.exports = router;
