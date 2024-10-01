import React, { useState } from 'react';
import createApiCall from '../api/api';

function FeedbackModal({ showModal, handleClose }) {
    const [feedback, setFeedback] = useState('');

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleFeedBack = async () => {
        const feedbackApi = createApiCall("feedback");
        
        try {
            const response = await feedbackApi({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });
    
            if (response) {
                console.log("Feedback submitted successfully:", response);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle feedback submission (e.g., send to API)
        console.log("Feedback submitted:", feedback);
        handleClose(); // Close the modal after submission
    };

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} aria-hidden={!showModal}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-black">Feedback</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="feedback" className="form-label">Your Feedback</label>
                                <textarea
                                    id="feedback"
                                    className="form-control"
                                    value={feedback}
                                    onChange={handleFeedbackChange}
                                    rows={4}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-green p-2" onClick={handleFeedBack}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackModal;
