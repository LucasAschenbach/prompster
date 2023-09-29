import React from "react";
import ReactDOM from "react-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import Root from "./components/Root";
import "../styles/global.css";

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <Root />
    </SettingsProvider>
  </React.StrictMode>,
  rootElement
);
