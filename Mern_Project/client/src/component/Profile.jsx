import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useGlobalContext } from "../context/context";
import { FiEdit } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import useUserData from "./useUserData";

export default function Profile() {
  const { auth } = useGlobalContext();
  const [user, setUser] = useState("");
  let { userData } = useUserData();
  const navigate = useNavigate();

  return (
    auth?.user && (
      <>
        <section className="vh-100">
          {/* <LayoutFile /> */}
          <MDBContainer className="py-5 ">
            <MDBRow className="justify-content-center align-items-center p-5">
              <MDBCol lg="6" className="mb-4 mb-lg-0">
                <MDBCard className="mb-3" style={{ borderRadius: ".5rem" }}>
                  <MDBRow className="g-0">
                    <MDBCol
                      md="4"
                      className="gradient-custom text-center text-white "
                      style={{
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: ".5rem",
                        background: "rgb(193, 114, 160)",
                      }}
                    >
                      <MDBCardImage
                        src={`${userData?.photo}`}
                        alt="Avatar"
                        className="my-3 "
                        style={{
                          width: "140px",
                          height: "140px",
                          borderRadius: "10px",
                        }}
                        fluid
                      />

                      <NavLink
                        className={"nav-link"}
                        id="edit"
                        to={`/update-user/${auth?.user}`}
                      >
                        <FiEdit id="edit" />
                      </NavLink>
                    </MDBCol>
                    <MDBCol md="8">
                      <MDBCardBody className="p-4">
                        <MDBCol size="" className="mb-3">
                          <MDBTypography tag="h6">Name</MDBTypography>
                          <MDBCardText className="text-muted">
                            {userData?.name}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">
                            {userData?.email}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="" className="mb-3">
                          <MDBTypography tag="h6">Phone</MDBTypography>
                          <MDBCardText className="text-muted">
                            {userData?.phone}
                          </MDBCardText>
                        </MDBCol>
                      </MDBCardBody>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </>
    )
  );
}
