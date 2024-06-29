import { Button } from "bootstrap";
import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";
import { toast } from "react-toastify";
import moment from "moment";
import { MdLocationPin } from "react-icons/md";
import { useGlobalContext } from "../context/context";
import { IoIosArrowBack } from "react-icons/io";

const singleBooking = () => {
  const navigate = useNavigate("");
  const { auth } = useGlobalContext();

  const { id } = useParams();
  const [showPhots, setShowPhotos] = useState(false);
  const [bookedPlace, setBookedPlace] = useState();
  const getBookedPlace = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get-single-booking/${id}`,
        {
          method: "GET",

          headers: {
            Authorization: auth?.token,
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setBookedPlace(dataFromResponse?.singlePlaceBooking);
        // console.log(bookedPlace);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBookedPlace();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  //show photos
  if (showPhots) {
    return (
      <div className=" showAllPhotos mb-5  shadow p-5">
        {" "}
        {window.scrollTo(0, 0)}
        <div className="">
          <button
            className="btn btn-color text-white"
            onClick={() => setShowPhotos(false)}
          >
            <FaWindowClose size={30} />{" "}
            <span className="mt-2">Close Photos</span>
          </button>
        </div>
        {bookedPlace?.place?.photos.length > 0 &&
          bookedPlace?.place?.photos?.map((ele, idx) => {
            return (
              <div key={idx} className="">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                    ele?.place?.photos[0]
                  }`}
                  alt=""
                  className="singleImg"
                />
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <button
          className="btn text-white btn-color mt-4"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack className="mx-2" style={{ marginTop: "-5px" }} />
          Go Back{" "}
        </button>
        <div className=" p-2">
          <h3 className="text-color mt-3">
            {bookedPlace?.payment[0]?.place?.title}
          </h3>
          <NavLink
            target="_blank"
            className={"text-color location"}
            to={`https://maps.google.com/?q=${bookedPlace?.payment[0]?.place?.address}`}
          >
            <MdLocationPin size={20} />
            <span>{bookedPlace?.payment[0]?.place?.address}</span>
          </NavLink>
        </div>

        <div className="mb-5">
          <div className="row">
            <div className="col-md-6">
              {bookedPlace?.place?.photos && (
                <img
                  // src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                  //   bookedPlace?.place?.photos[0]
                  // }`}
                  src={`${bookedPlace?.place?.photos[0]}`}
                  alt=""
                  className="singleImg "
                />
              )}
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <div>
                {bookedPlace?.place?.photos?.length > 1 && (
                  <>
                    {bookedPlace?.place?.photos && (
                      <img
                        // src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        //   bookedPlace?.place?.photos[1]
                        // }`}
                        src={`${bookedPlace?.place?.photos[1]}`}
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
                        <span className="mt-2">Show More</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 info">
            <div>
              <h4 className="text-color">More about your booking</h4>
              <p className="mt-4">
                {/* Price: <span>₹ {bookedPlace?.payment[0]?.price}</span> */}
              </p>
              {/* <p>{bookedPlace?.place?.des}</p> */}
              <p>
                Check in: {/* ().format("DD-mm-yyyy") */}
                {}
                {new Date(
                  bookedPlace?.payment[0]?.checkIn
                ).toLocaleDateString()}
              </p>
              <p>
                Check out:{" "}
                {new Date(
                  bookedPlace?.payment[0]?.checkOut
                ).toLocaleDateString()}
              </p>
              <p>
                Total Guest : <span>{bookedPlace?.payment[0]?.maxGuest}</span>
              </p>
              <p>
                Number of nights :{" "}
                <span>{bookedPlace?.payment[0]?.numberOfNights}</span>
                {/* {differenceInCalendarDays(
                  bookedPlace?.place?.checkOut,
                  bookedPlace?.place?.checkIn
                )} */}
              </p>
              <p style={{ fontSize: "30px" }}>
                Amount Paid : <span>₹{bookedPlace?.payment[0]?.price}</span>
              </p>
            </div>
          </div>

          {/* extra */}
          {bookedPlace?.place?.extra && (
            <>
              <div className="mt-4">
                <hr />
                <h3 className="text-color">More about place</h3>
                <p>{bookedPlace?.place?.des}</p>
                <p>{bookedPlace?.place?.extra}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default singleBooking;
