import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdOutlineUpload } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

function FormFileExample() {
  const navigate = useNavigate("");
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState([]);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation(); // Stop the event propagation here
    }

    setValidated(true);

    if (form.checkValidity() === false) {
      return; // Don't proceed if the form is still invalid
    }

    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("email", email);
    // formData.append("password", password);
    // formData.append("phone", phone);
    // formData.append("photo", photo);
    // formData.append("role", role);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ name, email, photo, phone, password }),
      });

      const dataFromResponse = await res.json();
      if (res.ok) {
        toast.success(dataFromResponse.message);
        navigate("/login");
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
            console.log(dataFromResponse);
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
  return (
    <>
      <div className=" mt-5 mb-5 text-white layout">
        <h3 className="text-center text-dark mb-3 ">Register</h3>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="mt-4 forms"
        >
          <Form.Group className="mb-3 " controlid="validationCustom04">
            <Form.Control
              type="file"
              except="/Images/*"
              required
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

          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label className="text-dark">Name</Form.Label>
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

          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label className="text-dark">Email</Form.Label>
            <Form.Control
              type="email"
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
            <Form.Label className="text-dark">Mobile Number</Form.Label>
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

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label className="text-dark">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="123453"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>

          {/* <Form.Select
            className="mb-3 mt-4"
            aria-label="Default select example"
            controlid="validationCustom04"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value={""}>Select Role</option>
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select a role
          </Form.Control.Feedback> */}

          <Button
            type="submit"
            className="btn btn-dark mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Submit
          </Button>

          <p className="mt-3 text-dark">
            Already Registered ?{" "}
            <NavLink to="/login" className={" linkHover"}>
              Login
            </NavLink>
          </p>
        </Form>
      </div>
    </>
  );
}

export default FormFileExample;
