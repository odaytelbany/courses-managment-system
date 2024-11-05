const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  register,
  login,
} = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");

const multer = require("multer");
const appError = require("../utils/appError");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType === 'image'){
        return cb(null, true);
    } else{
        return cb(appError.create('File must be an image', 400), false);
    }
}

const upload = multer({ storage: diskStorage, fileFilter: fileFilter });

router.route("/").get(verifyToken, getAllUsers);

router.route("/register").post(upload.single("avatar"), register);

router.route("/login").post(login);

module.exports = router;
