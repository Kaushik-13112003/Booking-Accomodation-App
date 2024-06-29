import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: [],
    token: "",
  });

  useEffect(() => {
    let getAuth = localStorage.getItem("booking");
    if (getAuth) {
      let parseUser = JSON.parse(getAuth);
      setAuth({
        user: parseUser?.loginData,
        token: parseUser.token,
      });
    }
  }, [auth?.user?._id]);

  return (
    <AppContext.Provider value={{ auth, setAuth }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
