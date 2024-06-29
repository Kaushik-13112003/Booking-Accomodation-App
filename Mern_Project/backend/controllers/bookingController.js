const bookedPlaceModel = require("../models/BookedPlaceModel");
const stripe = require("stripe")(
  "sk_test_51NfpAFSGhdFCFw6vFAVqpo5Gl9Ua9ETxXyCgXvxLDmNsOu5hNjn2Ajac0b9TX6FihjWtR8H50xr39r27WFJPaWXt00qZDdb2dP"
);

const bookingPlaceController = async (req, res) => {
  let { checkIn, checkOut, place, maxGuest, name, email, phone, price } =
    req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  if (!checkIn) {
    return res.status(400).json({ msg: "checkIn required" });
  }
  if (!checkOut) {
    return res.status(400).json({ msg: "checkOut required" });
  }
  if (!maxGuest) {
    return res.status(400).json({ msg: "maxGuest required" });
  }

  if (!name) {
    return res.status(400).json({ msg: "name required" });
  }
  if (!email) {
    return res.status(400).json({ msg: "email required" });
  }

  try {
    if (email) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid E-Mail Format" });
      } else {
        if (!phoneRegex.test(phone)) {
          return res.status(400).json({ message: "Invalid Mobile " });
        } else {
          const newBooking = await bookModel.create({
            name,
            email,
            phone,
            checkIn,
            checkOut,
            place,
            bookAmount: price,
            maxGuest,
          });

          await newBooking.save();
          return res
            .status(200)
            .json({ newBooking: newBooking, msg: "place booked" });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const getPlaceBookingController = async (req, res) => {
  let { userId } = req.query;
  try {
    const allBookings = await bookedPlaceModel
      .find({ bookedBy: userId })
      .sort({ createdAt: -1 })
      .populate("place");
    if (allBookings) {
      return res.status(200).json({ allBookings: allBookings });
    } else {
      return res.status(400).json({ msg: "no bookings found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getSinglePlaceBookingController = async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  try {
    const singlePlaceBooking = await bookedPlaceModel
      .findById({ _id: id })
      .populate("place");
    if (singlePlaceBooking) {
      return res.status(200).json({ singlePlaceBooking: singlePlaceBooking });
    } else {
      return res.status(400).json({ msg: "no booking found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const bookPlaceUsintStripeController = async (req, res) => {
  let { cart } = req.body;

  try {
    let lineItems = cart.map((ele) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: ele.place.title,

          metadata: {
            checkIn: ele.checkIn,
            checkOut: ele.checkOut,
            maxGuest: ele.maxGuest,
            numberOfNights: ele.numberOfNights,
          },
        },

        unit_amount: ele.price * 100,
      },
      quantity: 1, // assuming quantity is always 1
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/my-booking",
      cancel_url: "http://localhost:5173/cancel",
    });

    if (session.id) {
      const bookedPlacePaymentDetails = await bookedPlaceModel.create({
        place: cart[0].place,
        payment: cart,
        bookedBy: req.userId,
        // placeData: cart,
      });
    }
    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
  }
};

const allBookingDatesController = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  if (!id) return;
  try {
    let findPlace = await bookedPlaceModel.find({ place: id });
    console.log(findPlace);
    return res.status(200).json(findPlace);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  bookingPlaceController,
  getSinglePlaceBookingController,
  getPlaceBookingController,
  bookPlaceUsintStripeController,
  allBookingDatesController,
};
