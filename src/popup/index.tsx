import React from "react";
import ReactDOM from "react-dom";
import Popup from "./Popup";
import { PromptProvider } from "../contexts/PromptContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import "../../styles/global.css";

ReactDOM.render(
  <React.StrictMode>
    <div className="prompster">
      <PromptProvider>
        <SettingsProvider>
          <Popup />
        </SettingsProvider>
      </PromptProvider>
    </div>
  </React.StrictMode>,
  document.getElementById("popup-root")
);
