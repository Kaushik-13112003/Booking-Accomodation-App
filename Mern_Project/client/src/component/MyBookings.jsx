import { differenceInCalendarDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import { NavLink, useNavigate } from "react-router-dom";

const MyBookings = () => {
  const navigate = useNavigate("");
  const { auth } = useGlobalContext();
  const [bookedPlace, setBookedPlace] = useState([]);
  const getPlaces = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get-bookings?userId=${
          auth.user
        }`,
        {
          method: "GET",

          headers: {
            Authorization: auth?.token,
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();
      console.log(dataFromResponse);

      if (res.ok) {
        setBookedPlace(dataFromResponse?.allBookings);
        console.log(bookedPlace);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  return (
    <>
      <div className="text-center mt-4"></div>

      {/* all places */}
      <div className="container mb-5">
        {bookedPlace?.length <= 0 && (
          <>
            <div className=" justify-content-center align-items-center d-flex flex-column">
              <p className="text-center mt-5">no bookings yet !!</p>
              <button
                onClick={() => navigate("/")}
                className="btn bg-color text-white"
              >
                Let's Book
              </button>
            </div>
          </>
        )}
        {bookedPlace.map((ele, idx) => {
          return (
            <NavLink
              className={"nav-link mt-5"}
              to={`/single-booking/${ele._id}`}
              key={idx}
            >
              <div className=" placeData">
                <div className="">
                  {ele?.place?.photos?.length > 0 && (
                    <>
                      <img
                        // src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        //   ele?.place?.photos[0]
                        // }`}

                        src={`${ele?.place?.photos[0]}`}
                        alt="booked place image"
                        id="bookedPlaceImage"
                      />
                    </>
                  )}
                </div>
                <div>
                  {/* <h3>{JSON.stringify(ele.payment)}</h3> */}
                  <h3>{ele.payment[0].place.title}</h3>
                  <p>
                    booking from{" "}
                    {new Date(ele?.place?.checkIn).toLocaleDateString()} to{" "}
                    {new Date(ele?.place?.checkOut).toLocaleDateString()}{" "}
                  </p>
                  <p>
                    Number of nighs :{" "}
                    {/* {differenceInCalendarDays(
                      ele.place.checkOut,
                      ele.place.checkIn
                    )} */}
                    {ele?.payment[0]?.numberOfNights}
                  </p>
                  <p>
                    Amount Paid : <span>₹ {ele?.payment[0]?.price}</span>
                  </p>{" "}
                  <p>Max Guest : {ele.place.maxGuest}</p>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default MyBookings;
