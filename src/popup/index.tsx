import React from "react";
import ReactDOM from "react-dom";
import Popup from "./Popup";
import { PromptProvider } from "../contexts/PromptContext";
import "../../styles/global.css";

ReactDOM.render(
  <React.StrictMode>
    <div className="prompster">
      <PromptProvider >
        <Popup />
      </PromptProvider>
    </div>
  </React.StrictMode>,
  document.getElementById("popup-root")
);
