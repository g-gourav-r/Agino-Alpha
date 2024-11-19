import React, { useState } from "react";
import FeedbackModal from "../FeedbackModal/FeedbackModal";

function WindowTemplate({ sideBar, Maincontent }) {
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to manage sidebar visibility

  const handleFeedbackModel = () => {
    setShowModal(true); // Show the modal
  };

  const handleClose = () => {
    setShowModal(false); // Close the modal
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle the sidebar visibility
  };

  return (
    <div className="page-wrapper container-fluid h-100 d-flex flex-column">
      <marquee>Welcome to the Alpha version! You're part of the journey as our team works to enhance your experience.</marquee>
      <div className="window-wrapper border my-2 flex-grow-1 rounded h-100">
        <div className="row g-0 h-100">
          {/* Sidebar */}
          <div
            className={`col-md-2 d-flex flex-column h-100 ${
              isSidebarVisible ? "" : "d-none"
            } d-md-block`}
          >
            <div className="side-bar d-flex flex-column flex-grow-1 h-100 overflow-auto">
              {sideBar}
              <div className="mt-auto p-3">
                <div className="btn-outline d-flex align-items-center justify-content-between mx-3 mb-1">
                  <i className="btn-outline bi bi-slack fs-6 me-3"></i>
                  <i className="btn-outline bi bi-microsoft-teams fs-6 me-3"></i>
                  <i className="btn-outline bi bi-discord fs-6 me-3"></i>
                </div>
                <button
                  type="button"
                  className="btn-green w-100 p-1"
                  onClick={handleFeedbackModel}
                >
                  Feedback
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Toggle Button */}
          <div
            className="col-12 d-md-none position-fixed"
            style={{ top: "50%", left: "-13px", zIndex: 1000 }}
          >
            <button
              className="btn-green rounded-0 rounded-end"
              onClick={toggleSidebar}
              style={{ padding: "10px", fontSize: "20px" }}
            >
              {isSidebarVisible ? "<" : ">"}{" "}
              {/* Show '<' when sidebar is open, '>' when closed */}
            </button>
          </div>

          {/* Main Content */}
          <div className="content-window col-12 col-md-10 h-100">
            <div className="content-window-wrapper p-2 h-100">
              <div className="main-content-window bg-light border h-100">
                {Maincontent}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal showModal={showModal} handleClose={handleClose} />
    </div>
  );
}

export default WindowTemplate;
