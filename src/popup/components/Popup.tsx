import React from "react";
import { MemoryRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SearchPage from "../pages/SearchPage";
import EditPage from "../pages/EditPage";
import "../../../styles/transitions.css";

const Popup: React.FC = () => {
  return (
    <Router>
      <PopupContent />
    </Router>
  );
};

const PopupContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-96 border-zinc-700 bg-black">
      <TransitionGroup className="h-full">
        <CSSTransition
          key={location.key}
          classNames="slide"
          timeout={{ enter: 300, exit: 300 }}
        >
          <Routes location={location}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/edit/:index" element={<EditPage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default Popup;
