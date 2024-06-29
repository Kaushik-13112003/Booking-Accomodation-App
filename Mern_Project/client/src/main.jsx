import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/context.jsx";
import { SaveProvider } from "./context/savePlaceContext.jsx";
import { SearchProvider } from "./context/searchContext.jsx";
import { GridProvider } from "./context/gridContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <GridProvider>
        <SearchProvider>
          <SaveProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SaveProvider>
        </SearchProvider>
      </GridProvider>
    </AppProvider>
  </React.StrictMode>
);
