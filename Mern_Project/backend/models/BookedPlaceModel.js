const mongoose = require("mongoose");

const schemaDesign = new mongoose.Schema(
  {
    place: {
      type: mongoose.ObjectId,
      ref: "placeData",
    },

    payment: {},

    bookedBy: {
      type: mongoose.ObjectId,
      ref: "userData",
    },
  },

  {
    timestamps: true,
  }
);

const bookedPlaceModel = new mongoose.model("bookedPlace", schemaDesign);
module.exports = bookedPlaceModel;
