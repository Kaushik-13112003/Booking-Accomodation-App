const express = require("express");
const {
  registerController,
  loginController,
  getSingleUserImageController,
  updateUserController,
  getSingleUserController,
  getUserDataController,
} = require("../controllers/userController");
const router = express.Router();
const formidable = require("express-formidable");
const { authController } = require("../middleware/auth");

router.post("/register", registerController);

router.post("/login", loginController);
router.get("/user-photo/:id", getSingleUserImageController);
router.put(
  "/update-user/:id",
  authController,
  formidable(),
  updateUserController
);

router.get("/single-user/:id", getSingleUserController);

router.get("/get-single-user", getUserDataController);

router.get("/auth", authController, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = router;
