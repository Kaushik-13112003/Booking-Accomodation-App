import React from "react";
import { useSearchContext } from "../context/searchContext";
import { NavLink } from "react-router-dom";

const SearchResult = () => {
  const { search } = useSearchContext();

  return (
    <>
      {" "}
      <div className="container mb-5">
        {search?.data?.length === 0 && (
          <>
            <div className="text-center">
              <p className="text-center text-color mt-4">No match found</p>
            </div>
          </>
        )}

        {search?.data?.length !== 0 && (
          <p className="text-center text-color mt-4">
            {search?.data?.length === 1
              ? search?.data?.length + " result found"
              : search?.data?.length + " results found"}
          </p>
        )}

        <div className="text-center">
          <NavLink to="/">
            <button className="btn btn-color text-white">Go Back</button>
          </NavLink>
        </div>

        {search?.data?.map((ele, idx) => {
          return (
            <>
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
                      //   id="PlaceImage"
                    />
                  </div>
                  <div>
                    <h3>{ele.title}</h3>
                    <p>{ele.address}</p>
                    <p>₹ {ele.price} per night</p>
                  </div>
                </div>
              </NavLink>
            </>
          );
        })}
      </div>
    </>
  );
};

export default SearchResult;
