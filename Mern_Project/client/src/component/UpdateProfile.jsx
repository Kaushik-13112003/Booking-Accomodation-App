import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import { FaTrash } from "react-icons/fa";

function UpdateProfile() {
  const { auth, setAuth } = useGlobalContext();
  const navigate = useNavigate("");
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const { id } = useParams();

  const getUser = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get-single-user?id=${auth?.user}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setName(dataFromResponse?.singleUser?.name);
        setPhoto(dataFromResponse?.singleUser?.photo);
        setPhone(dataFromResponse?.singleUser?.phone);
        setEmail(dataFromResponse?.singleUser?.email);
        // console.log(place);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (photo?.length <= 0) {
      toast.error("upload profile picture");
      return;
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation(); // Stop the event propagation here
    }

    setValidated(true);

    if (form.checkValidity() === false) {
      return; // Don't proceed if the form is still invalid
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    photo && formData.append("photo", photo);
 
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-user/${id}`,
        {
          method: "PUT",

          headers: {
            Authorization: auth?.token,
          },

          body: formData,
        }
      );

      const dataFromResponse = await res.json();
      if (res.ok) {
        toast.success(dataFromResponse.message);
        // localStorage.setItem(
        //   "booking",
        //   JSON.stringify({
        //     ...JSON.parse(localStorage.getItem("booking")),
        //     loginData: dataFromResponse?.loginData,
        //   })
        // );
        // setAuth({
        //   ...auth,
        //   user: dataFromResponse?.updateUser,
        // });
        navigate("/profile");
        // navigate(-1);
      } else {
        toast.error(dataFromResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // handleImageUpload
  const handleImageUpload = (event) => {
    let files = event.target.files;
    // console.log(files);

    if (files) {
      let data = new FormData();

      if (files.length === 1) {
        data.set("photos", files[0]);

        try {
          let uploadImagePromise = new Promise(async (resolve, reject) => {
            let res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/uploadPhoto`,
              {
                method: "POST",

                body: data,
              }
            );

            let dataFromResponse = await res.json();
            // console.log(dataFromResponse);
            if (res.ok) {
              resolve();
              setPhoto(dataFromResponse?.links[0]);
            } else {
              reject();
            }
          });

          toast.promise(uploadImagePromise, {
            loading: "uploading image...",
            success: "image uploaded !!",
            error: "somethong went wrong",
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getUser();
    }
  }, [id]);

  return (
    <>
      {/* <LayoutFile /> */}

      <div className="container mt-5 mb-5   d-flex justify-content-center align-items-center flex-column">
        <h3 className="text-center text-color mb-3 ">Update Profile</h3>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="mt-4  text-color updateform"
        >
          <Form.Group className="mb-3 " controlid="validationCustom04">
            <Form.Control
              type="file"
              except="/Images/*"
              onChange={handleImageUpload}
            />

            <Form.Control.Feedback type="invalid">
              Please choose profile picture.
            </Form.Control.Feedback>
            {photo?.length > 0 && (
              <>
                <div className=" d-flex justify-content-center align-items-center  flex-column">
                  <div
                    style={{ width: "150px" }}
                    className="mt-5 position-relative"
                  >
                    <img
                      src={photo}
                      className=" cursor-pointer  rounded-2 object-contain  w-100 "
                    ></img>
                    <button
                      className="btn "
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "-10px",
                      }}
                      type="button"
                      onClick={() => setPhoto([])}
                    >
                      {" "}
                      <FaTrash className=" delete" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </Form.Group>

          {/* <Form.Group className="mb-3 " controlid="validationCustom04">
            <label
              id="photo"
              className="btn bg-color text-white"
              style={{ width: "100%" }}
            >
              {photo ? photo.name : "Upload photo"}
              <input
                type="file"
                className="form-control "
                id="photo"
                except="/Images/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                hidden
              />
            </label>

            <Form.Control.Feedback type="invalid">
              Please choose profile picture.
            </Form.Control.Feedback>
          </Form.Group>
          {!photo ? (
            <>
              <img
                className="mt-5 mb-3 "
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  display: "block",
                  margin: "auto",
                }}
                alt="Profile picture"
                src={`${import.meta.env.VITE_BACKEND_URL}/user-photo/${id}`}
              />
            </>
          ) : (
            <>
              {" "}
              <img
                className="mt-5 mb-3"
                src={URL.createObjectURL(photo)}
                alt="Profile picture"
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  display: "block",
                  margin: "auto",
                }}
              ></img>
            </>
          )} */}

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="xyz"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              disabled
              placeholder="xyz@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide an valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234535670"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid phone number.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            className="btn btn-dark mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Save
          </Button>

          <p className="mt-3 text-dark">
            Go Back ?{" "}
            <NavLink to="/profile" className={" linkHover"}>
              Profile
            </NavLink>
          </p>
        </Form>
      </div>
    </>
  );
}

export default UpdateProfile;
