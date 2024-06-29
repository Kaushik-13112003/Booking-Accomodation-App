const express = require("express");
const {
  photoLinkController,
  uploadPhotoController,
  createPlaceController,
  getSinglePlaceController,
  getPlaceController,
  deletePlaceController,
  updatePlaceController,
  searchPlaceController,
} = require("../controllers/placeController");
const multer = require("multer");
const { authController } = require("../middleware/auth");

const router = express.Router();
const photoMiddleware = multer({ dest: "/tmp" });

router.post("/photolink", photoLinkController);

// const photoMiddleware = multer({ dest: "uploads/" });

// router.post(
//   "/uploadPhoto",
//   photoMiddleware.array("photos", 100),
//   uploadPhotoController
// );


router.post(
  "/uploadPhoto",
  photoMiddleware.array("photos", 100),
  uploadPhotoController
);

router.post("/create-place", authController, createPlaceController);

router.get("/get-place", getPlaceController);

router.get("/get-single-place/:id", getSinglePlaceController);

router.delete("/delete-place/:id", authController, deletePlaceController);

router.put("/update-place/:id", authController, updatePlaceController);

//search
router.get("/search/:keyword", searchPlaceController);

module.exports = router;
