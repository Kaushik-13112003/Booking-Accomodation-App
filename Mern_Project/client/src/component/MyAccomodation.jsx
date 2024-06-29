import React, { useEffect, useState } from "react";
import { FiDelete, FiEdit, FiTrash } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/context";

const MyAccomodation = () => {
  const { auth } = useGlobalContext();
  // console.log(auth);
  const [place, setPlace] = useState([]);
  const getPlaces = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get-place?id=${auth?.user}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setPlace(dataFromResponse?.allPlaces);
        // console.log(place);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //delete

  const handleDelete = async (id) => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-place/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: auth?.token,
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        toast.success(dataFromResponse?.msg);
        getPlaces();
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
      <div className="text-center mt-4">
        <NavLink className={"nav-link"} to="/add-accomodation">
          <button className="btn bg-color text-white">
            <IoMdAdd className="mx-2" style={{ marginTop: "-5px" }} />
            Add new place
          </button>
        </NavLink>
      </div>

      {/* all places */}
      <div className="container mb-5">
        {place?.length <= 0 && (
          <>
            <p className="text-center mt-5">no accomodation found !!</p>
          </>
        )}
        {place.map((ele, idx) => {
          return (
            <NavLink
              key={idx}
              className={"nav-link mt-5 position-realtive shadow"}
              to={`/single-place/${ele?._id}`}
            >
              {ele?.userId?._id === auth?.user && (
                <>
                  <NavLink to={`/update-place/${ele?._id}`}>
                    <button className="btn m-3">
                      <FiEdit size={20} />
                    </button>
                  </NavLink>
                  <NavLink onClick={() => handleDelete(ele?._id)}>
                    <button className="btn text-danger mb-3 mt-3">
                      <FiTrash size={20} color="" />
                    </button>
                  </NavLink>
                </>
              )}
              <div key={idx} className=" placeData">
                <div className=" text-color "></div>
                <div className="">
                  {ele.photos.length > 0 && (
                    <>
                      <img
                        // src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        //   ele.photos[0]
                        // }`}
                        src={`${ele.photos[0]}`}
                        alt=""
                        // style={{ width: "200px", height: "200px" }}
                      />
                    </>
                  )}
                </div>
                <div>
                  <h3>{ele.title}</h3>
                  <p>{ele.des?.substring(0, 200) + "..."}</p>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default MyAccomodation;
