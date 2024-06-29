import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";

const useUserData = () => {
  const { auth } = useGlobalContext();
  const [userData, setUserData] = useState("");
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
        setUserData(dataFromResponse?.singleUser);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (auth?.user) {
      getUser();
    }
  }, [auth?.user]);
  return { userData };
};

export default useUserData;
