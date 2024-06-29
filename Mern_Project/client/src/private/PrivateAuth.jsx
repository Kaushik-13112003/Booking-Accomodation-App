import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import { Outlet } from "react-router-dom";
import Spinner from "./Spinner";

export default function PrivateAuth() {
  const [ok, setOk] = useState(false);
  const { auth } = useGlobalContext();

  const getAuth = async () => {
    try {
      let res = await fetch("http://localhost:5000/auth", {
        method: "GET",

        headers: {
          Authorization: auth?.token,
        },
      });

      if (res.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    //token
    if (auth?.token) {
      getAuth();
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
