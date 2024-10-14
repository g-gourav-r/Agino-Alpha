import React, { useState } from 'react';
import FeedbackModal from '../FeedbackModal/FeedbackModal';

function WindowTemplate({ sideBar, Maincontent }) {
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility

    const handleFeedbackModel = () => {
        setShowModal(true); // Show the modal
    };

    const handleClose = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <div className="page-wrapper container-fluid h-100 d-flex flex-column">
            <div className="window-wrapper border my-2 flex-grow-1 rounded h-100">
                <div className="row g-0 h-100">
                    <div className="col-md-2 d-none d-md-block d-flex flex-column h-100">
                        <div className="side-bar d-flex flex-column flex-grow-1 h-100 overflow-auto">
                            {sideBar}
                            <div className="mt-auto p-3">
                                <div className="btn-outline d-flex align-items-center justify-content-between mx-3 mb-1 ">
                                    <i class="btn-outline bi bi-slack fs-6 me-3"></i>
                                    <i class="btn-outline bi bi-microsoft-teams fs-6 me-3"></i>
                                    <i class="btn-outline bi bi-discord fs-6 me-3"></i>
                                </div>
                                <button type="button" className="btn-green w-100 p-1" onClick={handleFeedbackModel}>
                                    Feedback
                                </button>
                            </div>
                        </div>
                    </div>
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
