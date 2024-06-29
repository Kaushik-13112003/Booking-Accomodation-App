const express = require("express");
const {
  bookingPlaceController,
  getSinglePlaceBookingController,
  getPlaceBookingController,
  bookPlaceUsintStripeController,
  allBookingDatesController,
} = require("../controllers/bookingController");
const { authController } = require("../middleware/auth");
const router = express.Router();

router.post("/booking", authController, bookingPlaceController);

router.get("/get-bookings", authController, getPlaceBookingController);

router.get(
  "/get-single-booking/:id",
  authController,
  getSinglePlaceBookingController
);

router.post("/payment", authController, bookPlaceUsintStripeController);

router.get("/booked-dates/:id", allBookingDatesController);

module.exports = router;
