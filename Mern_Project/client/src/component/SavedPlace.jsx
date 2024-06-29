import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CiSaveDown1 } from "react-icons/ci";
import { useSaveContext } from "../context/savePlaceContext";

const SavedPlace = () => {
  const [places, setPlaces] = useState([]);
  const { savePlaceFunction, savePlace, placeId } = useSaveContext();

  const getAllPlaces = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-place`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      const dataFromResponse = await res.json();

      if (res.ok) {
        setPlaces(dataFromResponse?.allPlaces);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPlaces();
  }, []);
  return (
    <>
      <div className="text-center mt-4"></div>

      {/* all places */}
      <div className="container mb-5">
        {savePlace?.length <= 0 && (
          <>
            <p className="text-center mt-5">no accomodation found !!</p>
          </>
        )}
        {savePlace.map((ele, idx) => {
          const isExist = placeId.includes(ele?._id); //edit

          return (
            <>
              <div style={{ position: "relative" }}>
                <NavLink
                  className={"nav-link mt-5"}
                  to={`/single-place/${ele._id}`}
                  key={idx}
                >
                  <div className=" placeData">
                    <div className="">
                      <img
                        // src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        //   ele.photos[0]
                        // }`}
                        src={`${ele.photos[0]}`}
                        alt={ele.photos[0]}
                        id="savedImage"
                      />
                    </div>
                    <div>
                      <h3>{ele.title}</h3>
                      <p>{ele.address}</p>
                      <p>₹ {ele.price} per night</p>
                    </div>
                  </div>
                </NavLink>
                <div
                  style={{
                    position: "absolute",
                    right: "20px",
                    bottom: "15px",
                  }}
                >
                  <CiSaveDown1
                    size={30}
                    target="save"
                    style={{ cursor: "pointer" }}
                    className={`${isExist ? " text-primary " : " text-color"}`}
                    onClick={() => savePlaceFunction(ele)}
                  />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default SavedPlace;
