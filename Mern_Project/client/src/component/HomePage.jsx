import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiSaveDown1 } from "react-icons/ci";
import { useSaveContext } from "../context/savePlaceContext";
import { useSearchContext } from "../context/searchContext";
import { toast } from "react-toastify";
import { useGridContext } from "../context/gridContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoMdAdd } from "react-icons/io";

const HomePage = () => {
  const navigate = useNavigate("");
  const [places, setPlaces] = useState([]);
  const { search, setSearch } = useSearchContext();
  const { handleGridChangeClick, isGrid, setIsGrid } = useGridContext();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getAllPlaces = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-place`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dataFromResponse = await res.json();
      if (res.ok) {
        setPlaces(dataFromResponse?.allPlaces);
      } else {
        toast.error(dataFromResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //fetch more
  const fetchMore = () => {
    getAllPlaces();
  };
  //search
  const handleSearch = async (event) => {
    event.preventDefault();

    if (search.keyword === "") {
      toast.error("Enter something to search");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/search/${search.keyword}`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();
      if (res.ok) {
        setSearch({
          ...search,
          data: dataFromResponse?.searchData,
          keyword: "",
        });
        navigate("/search-result");
      } else {
        toast.error(dataFromResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPlaces();
  }, [page, hasMore]);
  return (
    <>
      <div className="text-center mt-4">
        <div
          className=""
          style={{ position: "fixed", right: "20px", bottom: "20px" }}
        >
          <div className="isGrid ">
            {isGrid ? (
              <GiHamburgerMenu
                style={{ cursor: "pointer" }}
                size={30}
                className="gridIcons"
                onClick={handleGridChangeClick}
              />
            ) : (
              <BsFillGrid3X3GapFill
                style={{ cursor: "pointer" }}
                size={30}
                className="gridIcons"
                onClick={handleGridChangeClick}
              />
            )}
          </div>
        </div>

        <div className="container">
          <form className="form-inline d-flex gap-3 mb-5">
            <input
              className="form-control "
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value })
              }
              placeholder="Search places"
            />
            <button
              className="btn btn-color text-white "
              type="submit"
              onClick={handleSearch}
            >
              Search
            </button>
          </form>{" "}
        </div>
      </div>

      <div className="text-center mt-4">
        {places?.length <= 0 && <p className=" "> no accomodation found !!</p>}
      </div>

      {/* all places */}
      <div className="container mb-5">
        {isGrid && (
          <>
            {places.map((ele, idx) => {
              return (
                <>
                  <NavLink
                    className={"nav-link mt-5 shadow"}
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
                          // id="PlaceImage"
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
          </>
        )}
      </div>

      {!isGrid && (
        <>
          <div className="container mb-5">
            <div className="row  ">
              {places.map((ele, idx) => {
                return (
                  <div className=" col-md-6 mt-5" key={idx}>
                    <NavLink
                      className={"nav-link"}
                      to={`/single-place/${ele._id}`}
                    >
                      <div className="gridView shadow rounded-2">
                        <div>
                          {" "}
                          <img
                            // src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                            //   ele?.photos[0]
                            // }`}

                            src={`${ele?.photos[0]}`}
                            alt={ele?.photos[0]}
                            className=" rounded-top-2 "
                            // style={{ width: "100%" }}
                          />
                        </div>

                        <div>
                          <h3>{ele.title}</h3>
                          <p>{ele.address}</p>
                          <p>₹ {ele.price} per night</p>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
