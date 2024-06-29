import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const GridProvider = ({ children }) => {
  const [isGrid, setIsGrid] = useState(false);

  const handleGridChangeClick = () => {
    setIsGrid(!isGrid);
  };

  return (
    <AppContext.Provider value={{ isGrid, setIsGrid, handleGridChangeClick }}>
      {children}
    </AppContext.Provider>
  );
};

const useGridContext = () => {
  return useContext(AppContext);
};

export { GridProvider, useGridContext };
