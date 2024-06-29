import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/context";
import { MdLocationPin } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { CiMail, CiPhone, CiSaveDown1 } from "react-icons/ci";
import { loadStripe } from "@stripe/stripe-js/pure";
import { useSaveContext } from "../context/savePlaceContext";
import useUserData from "./useUserData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SinglePlace = () => {
  const navigate = useNavigate("");
  let { userData } = useUserData();
  const { savePlaceFunction, placeId } = useSaveContext();
  const [bookedDates, setBookedDates] = useState([]);
  const [place, setPlace] = useState("");
  const [showPhots, setShowPhotos] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [maxGuest, setMaxGuest] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { id } = useParams();
  const { auth } = useGlobalContext();
  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const getSinglePlace = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get-single-place/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setPlace(dataFromResponse?.singlePlace);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!maxGuest || !checkIn || !checkOut || !name || !email || !phone) {
      toast.error(`Please complete all fields.`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phone)) {
      toast.error("Invalid Mobile Number.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid Email.");
      return;
    }

    if (maxGuest <= 0) {
      toast.error(`Maximum guests must be at least 1.`);
      return;
    }

    if (maxGuest > place?.maxGuest) {
      toast.error(`Maximum ${place?.maxGuest} guests allowed.`);
      return;
    }
    const currentDate = new Date();
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (
      startDate.getTime() < currentDate.getTime() ||
      endDate.getTime() <= startDate.getTime()
    ) {
      toast.error(`Invalid dates.`);
      return;
    }

    // Check if the selected dates overlap with any booked dates
    const isDateBooked = bookedDates.some((booking) => {
      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);
      return startDate < bookingCheckOut && endDate > bookingCheckIn;
    });

    if (isDateBooked) {
      toast.error(`Selected dates are already booked.`);
      return;
    }

    let cart = [
      {
        id,
        place,
        name,
        email,
        phone,
        checkIn,
        checkOut,
        maxGuest,
        price: numberOfNights * place?.price,
        numberOfNights,
      },
    ];

    try {
      const stripe = await loadStripe(
        "pk_test_51NfpAFSGhdFCFw6vvmZkEzFLp6nFwcAhnvPeveuG5nD93sJpYhV8s5r2QtZswvtUN0SZ85RP0EX54jCZkzz9AXV000IL6ypDEP"
      );

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth?.token,
        },
        body: JSON.stringify({ cart }),
      });

      const session = await res.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBookedDates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/booked-dates/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch booked dates.");
      }

      const dataFromResponse = await response.json();
      const dates = dataFromResponse?.map((booking) => ({
        checkIn: new Date(booking.payment[0].checkIn),
        checkOut: new Date(booking.payment[0].checkOut),
      }));
      console.log(dates);
      setBookedDates(dates);
    } catch (err) {
      console.log(err);
      setBookedDates([]);
    }
  };

  useEffect(() => {
    if (id) {
      getSinglePlace();
      fetchBookedDates();
    }
    window.scrollTo(0, 0);

    setName(userData?.name);
    setEmail(userData?.email);
    setPhone(userData?.phone);
  }, [id, navigate]);

  // Show photos
  if (showPhots) {
    return (
      <div className=" showAllPhotos mb-5  shadow p-5">
        <div className="">
          <button
            className="btn btn-color text-white"
            onClick={() => setShowPhotos(false)}
          >
            <FaWindowClose size={30} />{" "}
            <span className="mt-2">Close Photos</span>
          </button>
        </div>
        {place?.photos.length > 0 &&
          place?.photos?.map((ele, idx) => {
            return (
              <div key={idx} className="">
                <img src={`${ele}`} alt="" className="singleImg" />
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="mt-5 d-flex justify-content-between align-content-center">
          <div>
            <button
              className="btn text-white btn-color "
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack />
              Go Back{" "}
            </button>
          </div>

          <div>
            <CiSaveDown1
              size={30}
              target="save"
              style={{ cursor: "pointer" }}
              className={`${
                placeId.includes(id) ? " text-primary " : " text-color"
              }`}
              onClick={() => savePlaceFunction(place)}
            />
          </div>
        </div>

        <div className=" p-2">
          <h3 className="text-color mt-3">{place.title}</h3>
          <NavLink
            target="_blank"
            className={"text-color location"}
            to={`https://maps.google.com/?q=${place?.address}`}
          >
            <MdLocationPin size={20} />
            <span>{place?.address}</span>{" "}
          </NavLink>
        </div>

        <div className="mb-5">
          <div className="row">
            <div className="col-md-6">
              {place.photos && (
                <img
                  src={`${place?.photos[0]}`}
                  alt=""
                  onClick={() => setShowPhotos(true)}
                  className="singleImg "
                />
              )}
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <div>
                {place.photos?.length > 1 && (
                  <>
                    {place.photos && (
                      <img
                        src={`${place?.photos[1]}`}
                        alt=""
                        onClick={() => setShowPhotos(true)}
                        className="singleImg"
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        right: "30px",
                        bottom: "-16px",
                      }}
                      className=""
                    >
                      <button
                        className="btn text-white btn-color mt-2"
                        onClick={() => setShowPhotos(true)}
                      >
                        <FiGrid size={20} />{" "}
                        {place.photos?.length >= 1 ? (
                          "Image view"
                        ) : (
                          <span>no Image</span>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 info">
            <div>
              <h4 className="text-color">Description</h4>
              <p style={{ fontSize: "30px" }}>
                Price : <span> ₹{place?.price}</span>
              </p>
              <p>
                Max Guest : <span>{place?.maxGuest}</span>
              </p>

              <div>
                <p>About Place : {place?.des}</p>
              </div>

              <p>
                Check in: <span>{place?.checkIn}</span>
              </p>
              <p>
                Check out: <span>{place?.checkOut}</span>
              </p>
            </div>

            <div
              className="bookform p-4 shadow rounded text-white"
              style={{ height: "100%" }}
            >
              <h3>
                Price ₹ <span>{place?.price} / night</span>
              </h3>

              <form action="" className="mt-3">
                <div className="form-group ">
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    placeholderText="select checkIn date"
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    excludeDates={bookedDates.map(
                      (booking) => new Date(booking.checkIn)
                    )}
                    className="form-control"
                  />
                </div>

                <div className="form-group mt-3">
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd
                    placeholderText="select checkOut date"
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    excludeDates={bookedDates.map(
                      (booking) => booking.checkOut
                    )}
                    className="form-control "
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="Max person " className="mb-2">
                    Max person
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={maxGuest}
                    min={1}
                    placeholder="ex:2 "
                    onChange={(e) => setMaxGuest(e.target.value)}
                  />
                </div>

                {numberOfNights > 0 && (
                  <>
                    <div className="form-group mt-3">
                      <label htmlFor="name " className="mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        placeholder="john"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="form-group mt-3">
                      <label htmlFor="email " className="mb-2">
                        E-Mail
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        placeholder="john@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group mt-3">
                      <label htmlFor="phone " className="mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={phone}
                        placeholder="3438243221"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  onClick={handlePayment}
                  className="btn btn-dark mt-4 "
                  style={{ width: "100%" }}
                >
                  Book Now
                  {numberOfNights > 0 && (
                    <span> for Price : ₹ {place?.price * numberOfNights}</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Additional information */}
          {place?.extra && (
            <>
              <div className="mt-4 text-justify">
                <hr />
                <h3 className="text-color">More about place</h3>
                <p>{place?.extra}</p>
              </div>
            </>
          )}
        </div>

        {/* Owner information */}
        <div className="mb-5">
          <h3 className="text-color">About Owner</h3>
          <img
            src={place?.userId?.photo}
            alt={place?.userId?.name}
            className=" rounded-2"
            style={{ width: "120px" }}
          />
          <h3 className=" mt-2">{place?.userId?.name}</h3>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <CiMail size={20} />
            <a target="_blank" href={`mailto:${place?.userId?.email}`}>
              {place?.userId?.email}
            </a>
          </div>

          <div className="d-flex gap-2 flex-wrap align-items-center">
            <CiPhone size={20} />{" "}
            <a target="_blank" href={`tel:${place?.userId?.phone}`}>
              {place?.userId?.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePlace;
