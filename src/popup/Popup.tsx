import React from "react";
import {
  MemoryRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SearchPage from "./pages/SearchPage";
import EditPage from "./pages/EditPage";
import DataPage from "./pages/DataPage";
import CreatePage from "./pages/CreatePage";
import "../../styles/transitions.css";

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
    <div className="w-96 bg-black">
      <TransitionGroup className="h-full">
        <CSSTransition
          key={location.key}
          classNames="slide"
          timeout={{ enter: 150, exit: 150 }}
        >
          <Routes location={location}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/edit/:index" element={<EditPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/create" element={<CreatePage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default Popup;
