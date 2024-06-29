import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
// import { useSearchContext } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../context/searchContext";

export default function SearchInput() {
  const { search, setSearch } = useSearchContext();
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/search/${search.keyword}`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();
      console.log(dataFromResponse?.searchData);
      if (res.ok) {
        setSearch({ ...search, data: dataFromResponse?.searchData });
        navigate("/search-result");
      } else {
        toast.error(dataFromResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return "";
}
