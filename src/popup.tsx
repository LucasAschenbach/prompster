import React from "react";
import ReactDOM from "react-dom";
import Popup from "./components/Popup";
import "../styles/global.css";

ReactDOM.render(
  <React.StrictMode>
    <div className="prompster">
      <Popup />
    </div>
  </React.StrictMode>,
  document.getElementById("popup-root")
);
