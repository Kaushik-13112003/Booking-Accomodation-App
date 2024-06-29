import React from "react";
import Register from "./component/Register";
import Login from "./component/Login";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateAuth from "./private/PrivateAuth";
import HomePage from "./component/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./component/Header";
import Profile from "./component/Profile";
import UpdateProfile from "./component/UpdateProfile";
import MyAccomodation from "./component/MyAccomodation";
import MyBookings from "./component/MyBookings";
import AddAccomodation from "./component/AddAccomodation";
import SinglePlace from "./component/SinglePlace";
import UpdatePlace from "./component/UpdatePlace";
import SingleBooking from "./component/SingleBooking";
import Success from "./component/Success";
import Cancel from "./component/Cancel";
import SavedPlace from "./component/SavedPlace";
import SearchResult from "./component/SearchResult";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster />
      <ToastContainer position="bottom-center" />

      <Header />
      <Routes>
        <Route path="/" element={<PrivateAuth />}>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/my-booking" element={<MyBookings />}></Route>
          <Route path="/add-accomodation" element={<AddAccomodation />}></Route>
          <Route path="/my-accomodation" element={<MyAccomodation />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/sucess" element={<Success />}></Route>
          <Route path="/cancel" element={<Cancel />}></Route>
          <Route path="/update-user/:id" element={<UpdateProfile />}></Route>
          <Route path="/single-place/:id" element={<SinglePlace />}></Route>
          <Route path="/single-booking/:id" element={<SingleBooking />}></Route>
          <Route path="/update-place/:id" element={<UpdatePlace />}></Route>
          <Route path="/saved-place" element={<SavedPlace />}></Route>
          <Route path="/search-result" element={<SearchResult />}></Route>
        </Route>

        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </>
  );
};

export default App;
