import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import { NavLink } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import useUserData from "./useUserData";

export default function Header() {
  const { auth, setAuth } = useGlobalContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  let { userData } = useUserData();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    setAuth({
      token: "",
      user: "",
    });
    localStorage.removeItem("booking");
    window.location.replace("/login");
    toast.success("Logout Successfully");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <NavLink to="/" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>Home</MenuItem>
      </NavLink>
      <NavLink to="/profile" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </NavLink>
      <NavLink to="/my-accomodation" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>My Accomodations</MenuItem>
      </NavLink>
      <NavLink to="/my-booking" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>My Bookings</MenuItem>
      </NavLink>
      <NavLink to="/saved-place" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>Favourite Place</MenuItem>
      </NavLink>
      {auth && userData?.name && (
        <>
          <hr />{" "}
          <MenuItem>
            Logged in as{" "}
            <span className="text-color mx-2"> {auth && userData?.name}</span>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <NavLink to="/" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>Home</MenuItem>
      </NavLink>
      <NavLink to="/profile" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>
          <p className="">Profile</p>
        </MenuItem>
      </NavLink>
      <NavLink
        to="/my-accomodation"
        className={"nav-link"}
        style={{ marginTop: "-16px" }}
      >
        <MenuItem onClick={handleMenuClose}>My Accomodations</MenuItem>
      </NavLink>
      <NavLink to="/my-booking" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>My Bookings</MenuItem>
      </NavLink>
      <NavLink to="/saved-place" className={"nav-link"}>
        <MenuItem onClick={handleMenuClose}>Favourite Place</MenuItem>
      </NavLink>

      {auth && userData?.name && (
        <>
          <hr />{" "}
          <MenuItem>
            Logged in as{" "}
            <span className="text-color mx-2"> {userData?.name}</span>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "rgb(193, 114, 160)" }}>
        <Toolbar>
          <NavLink to="/" className={"nav-link"}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              id="title"
              sx={{ display: "flex", alignItems: "center", mr: 2 }}
            >
              <Typography variant="h6" noWrap>
                BookBuddy
              </Typography>
            </Typography>
          </NavLink>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
