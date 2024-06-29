const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authController = async (req, res, next) => {
  try {
    const verify = await jwt.verify(
      req.headers.authorization,
      process.env.TOKEN
    );

    req.user = verify;
    req.userId = verify._id;
    next();
  } catch (err) {
    console.log(err);
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const getId = req.user._id;

    const findUser = await userModel.findById({ _id: getId }).select("-photo");

    if (findUser.role === "Admin") {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { authController, adminAuth };
