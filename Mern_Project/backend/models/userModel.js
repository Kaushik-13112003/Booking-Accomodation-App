const mongoose = require("mongoose");

const schemaDesign = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
    },

    password: {
      type: String,
      require: true,
    },

    photo: {
      type: String,
    },

    // role: {
    //   type: String,
    //   require: true,
    // },

    phone: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("userData", schemaDesign);
module.exports = userModel;
