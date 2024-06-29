import { React, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
// import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiFile, FiStar, FiTrash, FiUpload } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useGlobalContext } from "../context/context";

const AddAccomodation = () => {
  const navigate = useNavigate("");
  const { auth } = useGlobalContext();
  const [validated, setValidated] = useState(false);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [des, setDes] = useState("");
  const [extra, setExtra] = useState("");
  const [photoLink, setPhotoLink] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuest, setMaxGuest] = useState("");
  const [price, setPrice] = useState(100);
  const [uploadPhotos, setUploadPhotos] = useState([]);
  const [isChecked, setIsChecked] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/create-place`,
        {
          method: "POST",

          headers: {
            Authorization: auth?.token,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            checkIn,
            checkOut,
            maxGuest,
            address,
            title,
            perks: isChecked,
            photoLink,
            photos: uploadPhotos,
            extra,
            des,
            price,
          }),
        }
      );

      const dataFromResponse = await res.json();
      if (res.ok) {
        toast.success(dataFromResponse?.msg);
        navigate("/my-accomodation");
      } else {
        toast.error(dataFromResponse?.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadByPhotoLink = async (event) => {
    event.preventDefault();
    if (!photoLink.startsWith("http://") && !photoLink.startsWith("https://")) {
      toast.error("Please provide a valid URL.");
      return;
    }

    try {
      let imageUploadPromise = new Promise(async (resolve, reject) => {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/photolink`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ photoLink }),
          }
        );

        const dataFromResponse = await res.json();
        if (res.ok) {
          resolve();
          setUploadPhotos((prev) => [...prev, dataFromResponse?.url]);
          setPhotoLink("");
        } else {
          reject();
        }
      });

      toast.promise(imageUploadPromise, {
        loading: "uploading image...",
        success: "image uploaded",
        error: "something went wrong",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error uploading image");
    }
  };

  // const uploadPhoto = async (event) => {
  //   const files = event.target.files;
  //   // let data = files[0];
  //   const formData = new FormData();
  //   try {
  //     for (let i = 0; i < files.length; i++) {
  //       formData.append("photos", files[i]);
  //     }

  //     const res = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/uploadPhoto`,
  //       {
  //         method: "POST",

  //         body: formData,
  //       }
  //     );

  //     const dataFromResponse = await res.json();
  //     console.log(dataFromResponse?.links);

  //     if (res.ok) {
  //       // setUploadPhotos((prev) => {
  //       //   return [...prev, ...dataFromResponse?.uploadedPhots];
  //       // });

  //       setUploadPhotos((prev) => {
  //         return [...prev, ...dataFromResponse?.links];
  //       });
  //       // console.log(uploadPhotos);
  //     } else {
  //       console.log(err);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const uploadPhoto = async (event) => {
    const files = event.target.files;
    // let data = files[0];
    const formData = new FormData();
    try {
      for (let i = 0; i < files.length; i++) {
        formData.append("photos", files[i]);
      }

      let imageUploadPromise = new Promise(async (resolve, reject) => {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/uploadPhoto`,
          {
            method: "POST",

            body: formData,
          }
        );

        const dataFromResponse = await res.json();
        if (res.ok) {
          resolve();
          setUploadPhotos((prev) => {
            return [...prev, ...dataFromResponse?.links];
          });
        } else {
          reject();
        }
      });

      toast.promise(imageUploadPromise, {
        loading: "uploading image...",
        success: "image uploaded",
        error: "something went wrong",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckBox = (event) => {
    const { checked, value } = event.target;
    let all = [...isChecked];
    if (checked) {
      all.push(value);
    } else {
      all = all.filter((ele) => {
        return ele !== value;
      });
    }
    setIsChecked(all);
    // console.log(isChecked);
  };

  //remove photo
  const handleRemovePhoto = (id) => {
    let filterPhotos = uploadPhotos.filter((ele, idx) => {
      return idx !== id;
    });
    setUploadPhotos(filterPhotos);
  };

  //set photo
  const setPhotoToFirst = (id) => {
    let grabPhoto = uploadPhotos[id];
    let filterPhotos = uploadPhotos.filter((ele, idx) => {
      return idx !== id;
    });
    filterPhotos.unshift(grabPhoto);
    setUploadPhotos(filterPhotos);
  };

  return (
    <>
      <div className="text-center mt-4">
        <NavLink className={"nav-link"} to="/my-accomodation">
          <button className="btn bg-color text-white">
            <IoIosArrowBack className="mx-2" style={{ marginTop: "-5px" }} />
            Go Back
          </button>
        </NavLink>
      </div>{" "}
      <div className=" mt-5 mb-5 text-dark layout">
        <h3 className="text-center text-dark mb-3 ">New Place</h3>

        <form action="" className="forms ">
          <div className="form-group ">
            <label htmlFor="title " className="mb-2">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              value={title}
              placeholder="xyz"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="address " className="mb-2">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              value={address}
              placeholder="xyz"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <label htmlFor="photoLink " className="mt-3">
            Photo Link
          </label>

          <div className="form-group mt-2 photolink">
            <input
              type="text"
              className="form-control"
              value={photoLink}
              placeholder="xyz"
              onChange={(e) => setPhotoLink(e.target.value)}
            />
            <button
              type="button"
              className="btn bg-color text-white"
              onClick={uploadByPhotoLink}
            >
              Add Photo +
            </button>
          </div>

          <div className="mt-4 images">
            {uploadPhotos?.length > 0 &&
              uploadPhotos.map((imageName, index) => (
                <>
                  <div className="position-relative">
                    <img
                      key={index}
                      // src={`${
                      //   import.meta.env.VITE_BACKEND_URL
                      // }/uploads/${imageName}`}

                      src={`${imageName}`}
                      alt={`Uploaded ${index + 1}`}
                      className="uploaded-image "
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="btn  position-absolute bottom-0  mb-2 bg-color"
                      style={{ marginLeft: "-50px" }}
                    >
                      <FiTrash className="text-white " size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoToFirst(index)}
                      className="btn  position-absolute bottom-0  mb-2 btn-primary "
                      style={{ marginLeft: "-140px" }}
                    >
                      {index === 0 && (
                        <FaStar className="text-white " size={20} />
                      )}
                      {index !== 0 && (
                        <FiStar className="text-white " size={20} />
                      )}
                    </button>
                  </div>
                </>
              ))}
          </div>

          <div className="form-group">
            <div>
              <label
                id="photo"
                className="mt-3 btn bg-color text-white"
                style={{ width: "100px", height: "100px" }}
              >
                <div style={{ marginTop: "22px" }}>
                  <FiUpload className="" style={{ marginTop: "-5px" }} />
                  <span className="mx-2">Upload</span>
                </div>
                <input
                  type="file"
                  className="form-control "
                  id="photo"
                  multiple
                  onChange={uploadPhoto}
                  except="/Images/*"
                  // onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="form-group mt-3">
            <label htmlFor="Description " className="mb-2">
              Description
            </label>
            <textarea
              type="text"
              className="form-control"
              value={des}
              placeholder="description about place"
              onChange={(e) => setDes(e.target.value)}
            />
          </div>

          <label htmlFor="perks" className="mt-3">
            Perks
          </label>
          <div className="form-group perks">
            <div>
              <label htmlFor="Wifi">
                <input
                  type="checkbox"
                  onChange={handleCheckBox}
                  id="Wifi"
                  value={"Wifi"}
                />
                <span className="mx-2">Wifi</span>{" "}
              </label>
            </div>

            <div>
              <label htmlFor="Radio">
                <input
                  type="checkbox"
                  onChange={handleCheckBox}
                  id="Radio"
                  value={"Radio"}
                />
                <span className="mx-2">Radio</span>{" "}
              </label>
            </div>

            <div>
              <label htmlFor="Pets">
                <input
                  type="checkbox"
                  onChange={handleCheckBox}
                  id="Pets"
                  value={"Pets"}
                />
                <span className="mx-2">Pets</span>{" "}
              </label>
            </div>
          </div>

          <div className="form-group perks">
            <div>
              <label htmlFor="Free parking spot">
                <input
                  type="checkbox"
                  onChange={handleCheckBox}
                  id="Free parking spot"
                  value={"Free parking spot"}
                />
                <span className="mx-2">Free Parking Spot</span>{" "}
              </label>
            </div>

            <div>
              <label htmlFor="Tv">
                <input
                  type="checkbox"
                  onChange={handleCheckBox}
                  id="Tv"
                  value={"Tv"}
                />
                <span className="mx-2">Tv</span>{" "}
              </label>
            </div>

            <div>
              <label htmlFor="Private entrance">
                <input
                  type="checkbox"
                  onChange={handleCheckBox}
                  id="Private entrance"
                  value={"Private entrance"}
                />
                <span className="mx-2">Private entrance</span>{" "}
              </label>
            </div>
          </div>

          <div className="form-group mt-4">
            <label htmlFor="Extra info " className="mb-2">
              Extra info
            </label>
            <textarea
              type="text"
              className="form-control"
              value={extra}
              placeholder="extra info"
              onChange={(e) => setExtra(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="CheckIn " className="mb-2">
              CheckIn
            </label>
            <input
              type="text"
              placeholder="2:30 PM"
              className="form-control"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="CheckOut " className="mb-2">
              CheckOut
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="11:30 PM"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
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
              placeholder="ex:2 "
              onChange={(e) => setMaxGuest(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="price " className="mb-2">
              Price(₹)
            </label>
            <input
              type="number"
              className="form-control"
              value={price}
              placeholder="100"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-dark mt-4 rlbtn"
            style={{ width: "100%" }}
          >
            Create Place
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddAccomodation;
