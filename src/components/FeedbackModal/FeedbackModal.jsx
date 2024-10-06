import React, { useState } from 'react';
import createApiCall from '../api/api';
import { toast } from 'react-toastify';

function FeedbackModal({ showModal, handleClose}) {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            if (file.size > 1024 * 1024) { // 1 MB = 1024 * 1024 bytes
                toast.error('File size exceeds 1 MB. Please upload a smaller image.');
                setImage(null); // Clear the image if it exceeds the limit
                return; // Exit the function if the size limit is exceeded
            }    
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Store the Base64 string
            };
            reader.readAsDataURL(file); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for mandatory fields
        if (!feedback || !rating) {
            toast.error('Please fill out all mandatory fields.');
            return;
        }

        setLoading(true); // Set loading state

        // Submit feedback with the image if provided
        await submitFeedback(feedback, rating, image);
    };

    const handleCloseAndClear = () => {
        handleClose();       // Call the handleClose function
        setFeedback('');
        setImage(null);
    };

    const submitFeedback = async (feedbackText, ratingValue, imageBase64) => {
        const feedbackApi = createApiCall("api/feedback", "POST"); // Ensure POST is defined as a string
        const submitToastId = toast.loading("Submit your feedback"); 
        const payload = {
            feedback: feedbackText,
            rating: parseFloat(ratingValue),
            image: imageBase64
        };
    
        try {
            const token = localStorage.getItem("token");
            const response = await feedbackApi({
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // Make sure to set the content type
                },
                body: payload // Convert payload to JSON
            });

            toast.update(submitToastId, {
                render: "Feedback submitted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 1000,
              });
        } catch (error) {
            console.error("Error submitting feedback:", error); // Log the error for debugging
            toast.update(submitToastId,{
                render: `${error === 'string' ? error : 'An error occurred.'}`,
                type: "error",
                isLoading: false,
                autoClose: 1000,
            })
        } finally {
            setLoading(false); // Reset loading state
        }

        handleClose();
    };

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} aria-hidden={!showModal}>
            <div className="modal-dialog"> {/* Use modal-sm for a smaller modal size */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-black fs-6">Feedback</h5> {/* Reduced font size */}
                        <button type="button" className="btn-close" onClick={handleCloseAndClear}></button>
                    </div>
                    <div className="modal-body p-3"> {/* Reduced padding in modal body */}
                        <form onSubmit={handleSubmit}>
                            {/* Rating Section */}
                            <div className="mb-2">
                                <label className="form-label fs-6">Rate Your Experience *</label> {/* Reduced font size */}
                                <div className="mb-1 text-secondary fs-7">Please select a rating from 1 to 5.</div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fs-7">Terrible</span> {/* Reduced font size */}
                                    <span className="fs-7">Moderate</span> {/* Reduced font size */}
                                    <span className="fs-7">Happy</span> {/* Reduced font size */}
                                </div>
                                <div className="d-flex justify-content-between rating mb-2">
                                    {[...Array(5)].map((_, index) => (
                                        <input
                                            key={index}
                                            type="radio"
                                            name="rating"
                                            value={index + 1}
                                            onChange={handleRatingChange}
                                            className="form-check-input"
                                        />
                                    ))}
                                </div>
                            </div>
    
                            {/* Feedback Review Section */}
                            <div className="mb-2">
                                <label htmlFor="feedback" className="form-label fs-6">Your Feedback *</label> {/* Reduced font size */}
                                <div className="text-secondary mb-1 fs-7">Please provide your feedback regarding your experience.</div>
                                <textarea
                                    id="feedback"
                                    className="form-control fs-7" // Reduced font size
                                    value={feedback}
                                    onChange={handleFeedbackChange}
                                    rows={3} // Reduced rows for a smaller textarea
                                />
                            </div>
    
                            {/* Image Upload Section */}
                            <div className="mb-2">
                                <label htmlFor="imageUpload" className="form-label fs-6">Upload an Image (optional)</label> {/* Reduced font size */}
                                <div className="text-secondary mb-1 fs-7">You may upload an image for suggestions or improvements.</div>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleImageChange} // Add an event handler to manage the image upload
                                />
                            </div>

                            <button type="submit" className="btn-green btn-sm p-2 mt-2" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'} {/* Show loading text */}
                            </button> {/* Reduced padding */}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackModal;
