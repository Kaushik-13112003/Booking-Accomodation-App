const userModel = require("../models/userModel");
const fs = require("fs");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { hashPasswordFunc, normalPassword } = require("../helper/password");

const registerController = async (req, res) => {
  try {
    // let { name, email, password, phone, } = req.fields;
    let { name, email, password, phone, photo } = req.body;

    // let { photo } = req.files;

    //isExist
    const isExist = await userModel.findOne({ email: email });

    if (isExist) {
      return res.status(400).json({ message: "E-Mail already Exists" });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;

      if (email) {
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid E-Mail Format" });
        } else {
          if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid Mobile " });
          }
          password = await hashPasswordFunc(password);

          const newUser = new userModel({
            name,
            email,
            password,
            phone,
            photo,
          });

          // if (photo) {
          //   newUser.photo.data = fs.readFileSync(photo.path);
          //   newUser.photo.contentType = photo.type;
          // }

          await newUser.save();
          return res.status(200).json({ message: " Regisered Successfully" });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid E-Mail Format" });
      }
    }
    //verify email & password
    const verify = await userModel.findOne({ email: email }).select("-photo");

    if (password && email) {
      if (verify) {
        //decode password
        let isMatch = await normalPassword(password, verify.password);
        const token = await jwt.sign({ _id: verify._id }, process.env.TOKEN, {
          expiresIn: "7d",
        });

        if (isMatch) {
          return res.status(200).json({
            message: "Login Successfully",
            loginData: verify?._id,
            token: token,
          });
        } else {
          return res.status(400).json({ message: "Wrong Credentials" });
        }
      } else {
        return res.status(400).json({ message: "Wrong Credentials" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//get single user
const getSingleUserController = async (req, res) => {
  try {
    let { id } = req.params;

    const findUser = await userModel.findById(id);

    if (findUser) {
      return res.status(200).json({ findUser: findUser });
    } else {
      return res.status(400).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    let { phone, email, photo, name } = req.fields;
    // let { photo } = req.files;

    const updateUser = await userModel.findByIdAndUpdate(
      { _id: id },
      { photo, phone, name },
      { new: true }
    );
    // if (photo) {
    //   if (photo.size > 2 * 1024 * 1024) {
    //     return res.status(400).json({ message: "photo should be of < 2 MB " });
    //   } else {
    //     updateUser.photo.data = fs.readFileSync(photo.path);
    //     updateUser.photo.contentType = photo.type;
    //   }
    // }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid Mobile " });
    } else {
      updateUser.phone = phone;
    }

    await updateUser.save();
    return res
      .status(200)
      .json({ message: " Updated Successfully", loginData: updateUser });
  } catch (err) {
    console.log(err);
  }
};

//delete user
const deleteSingleUserController = async (req, res) => {
  try {
    let { id } = req.params;

    let deleteUser = await userModel.findByIdAndDelete({ _id: id });

    // await deleteUser.save();
    return res.status(200).json({ message: " Deleted Successfully" });
  } catch (err) {
    console.log(err);
  }
};

//get image
const getSingleUserImageController = async (req, res) => {
  try {
    let { id } = req.params;

    let findPhoto = await userModel.findOne({ _id: id }).select("photo");
    if (findPhoto.photo.data) {
      return res.status(200).send(findPhoto.photo.data);
    } else {
      return res.status(400).json({ message: "Photo not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

// get-single-user
const getUserDataController = async (req, res) => {
  try {
    let { id } = req.query;

    if (!id) {
      return;
    }

    const singleUser = await userModel.findById(id);
    console.log(singleUser);

    if (singleUser) {
      return res.status(200).json({ singleUser: singleUser });
    } else {
      return res.status(400).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  registerController,
  loginController,
  deleteSingleUserController,
  updateUserController,
  getSingleUserController,
  getSingleUserImageController,
  getUserDataController,
};
