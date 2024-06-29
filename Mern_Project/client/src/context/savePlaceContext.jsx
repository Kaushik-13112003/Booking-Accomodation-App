import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const SaveContext = createContext();

const SaveProvider = ({ children }) => {
  const [savePlace, setSavePlace] = useState([]);
  const [placeId, setPlaceId] = useState([]);

  const savePlaceFunction = async (place) => {
    let place_id = place._id;
    let isSaved = placeId.includes(place_id);

    if (!isSaved) {
      setSavePlace([...savePlace, place]);
      setPlaceId([...placeId, place_id]);
      localStorage.setItem("savePlace", JSON.stringify([...savePlace, place]));
      localStorage.setItem(
        "savePlaceID",
        JSON.stringify([...placeId, place_id])
      );
      toast.success("added to favourite");
    } else {
      let filterPlace = savePlace.filter((p) => {
        return p._id !== place_id;
      });
      setSavePlace(filterPlace);
      let filterPlaceId = placeId.filter((placeId) => {
        return placeId !== place_id;
      });
      setPlaceId(filterPlaceId);
      localStorage.setItem("savePlace", JSON.stringify(filterPlace));
      localStorage.setItem("savePlaceID", JSON.stringify(filterPlaceId));
      toast.success("remoed from favourite");
    }
  };

  useEffect(() => {
    let isExistsPlace = localStorage.getItem("savePlaceID");
    let isExistsPlaceData = localStorage.getItem("savePlace");

    if (isExistsPlace) {
      setPlaceId(JSON.parse(isExistsPlace));
      setSavePlace(JSON.parse(isExistsPlaceData));
    }
  }, []);

  return (
    <SaveContext.Provider
      value={{ savePlace, placeId, setSavePlace, savePlaceFunction }}
    >
      {children}
    </SaveContext.Provider>
  );
};

const useSaveContext = () => {
  return useContext(SaveContext);
};

export { SaveProvider, useSaveContext };
