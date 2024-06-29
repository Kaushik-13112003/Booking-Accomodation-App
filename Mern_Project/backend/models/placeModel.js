const mongoose = require("mongoose");

const schemaDesign = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },

    address: {
      type: String,
      require: true,
    },

    photos: [String],

    des: {
      type: String,
      require: true,
    },

    perks: [String],

    extra: {
      type: String,
    },

    checkIn: {
      type: String,
      require: true,
    },

    checkOut: {
      type: String,
      require: true,
    },

    maxGuest: {
      type: Number,
      require: true,
    },

    price: {
      type: Number,
      require: true,
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "userData",
    },
  },
  {
    timestamps: true,
  }
);

const placeModel = mongoose.model("placeData", schemaDesign);
module.exports = placeModel;
