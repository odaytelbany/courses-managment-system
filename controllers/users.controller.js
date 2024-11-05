const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");


const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { users: users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, password, email, role } = req.body;

  const oldEmail = await User.findOne({ email: email });
  if (oldEmail) {
    const error = appError.create(
      "This email is already exists!",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  });

  const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
  newUser.token = token;

  await newUser.save();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const {email, password} = req.body;

  if (!email && !password) {
    const error = appError.create("Email and password are required!",400,httpStatusText.FAIL);
    return next(error);
  }

  const user = await User.findOne({email: email});
  const matchedPassword = await bcrypt.compare(password, user?.password);

  if (user && matchedPassword){
    const token = await generateJWT({email: user.email, id: user._id, role: user.role});
    res.status(200).json({status: httpStatusText.SUCCESS, data: {token: token}})
  }else{
    const error = appError.create("Something went wrong!",500,httpStatusText.ERROR);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
