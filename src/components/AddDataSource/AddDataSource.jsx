import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import createApiCall, { GET, POST } from "../api/api.jsx";

// Set the app element for accessibility
Modal.setAppElement("#root");

function AddDataSource() {
  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentDb, setCurrentDb] = useState(null);
  const [formFields, setFormFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [addBtnVisible, setAddBtnVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileModalIsOpen, setFileModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  
  // Handle database form modal
  const [dbModalIsOpen, setDbModalIsOpen] = useState(false);
  const [formSubmitStatus, setFormSubmitStatus] = useState("");

  useEffect(() => {
    // Fetch data from API
    const AddDataSourceApi = createApiCall("databaseForm", GET);

    AddDataSourceApi({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status) {
          setData(response.data);
        } else {
          console.error("Failed to fetch data");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleButtonClick = (db) => {
    setCurrentDb(db);
    setFormFields(db.config.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
    setDbModalIsOpen(true); // Open the modal for DB form
  };

  const closeModal = () => {
    setDbModalIsOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    // Validate the form
    const isFormValid = Object.values(formFields).every((value) => value !== "");
    if (!isFormValid) {
      setFormSubmitStatus("Please fill in all required fields.");
      return;
    }

    // Make API call to submit form
    const submitApi = createApiCall("testConnection", POST);

    submitApi({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formFields),
    })
      .then((response) => {
        if (response.status) {
          setFormSubmitStatus(response.status);
          setDbModalIsOpen(false);
        } else {
          setFormSubmitStatus("Failed to submit the form.");
        }
      })
      .catch((error) => {
        setFormSubmitStatus("Error submitting the form.");
        console.error("Error submitting form:", error);
      });
  };

  const handleFileUpload = () => {
    setFileModalIsOpen(true);
    setUploadStatus("");

  };

  const closeFileModal = () => {
    setFileModalIsOpen(false);
    setUploadStatus("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitFile = () => {
    if (!file) {
      setUploadStatus("Please select a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    setLoading(true);
  
    // Make POST request to uploadSheet API
    const uploadApi = createApiCall("uploadSheet", POST);
  
    uploadApi({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData, // Use `body` for file uploads
    })
      .then((response) => {
        setLoading(false);
        if (response.status) {
          setUploadStatus("File uploaded successfully!");
        } else {
          setUploadStatus("File upload failed.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setUploadStatus(error.message);
        console.error("Error uploading file:", error);
      });
  };
  

  return (
    <div>
      <h1 className="ms-4 p-4 text-secondary">Add Data Base</h1>
      <div className="mx-4 px-4 d-flex flex-wrap">
        {data.map((db) => (
          <button
            key={db._id}
            className="d-flex align-items-center btn-green-outline p-2 m-2"
            onClick={() => handleButtonClick(db)}
            style={{ width: "200px", height: "50px" }}
          >
            <i className="bi bi-database-fill me-2"></i>
            <span>{db.dbtype}</span>
          </button>
        ))}
      </div>

      <h1 className="ms-4 p-4 text-secondary">Upload Flat File</h1>
      <div className="mx-4 px-4 d-flex flex-wrap">
        <button
          className="d-flex align-items-center btn-green-outline p-2 m-2"
          onClick={handleFileUpload}
          style={{ width: "200px", height: "50px" }}
        >
          <i className="bi bi-file-earmark-spreadsheet-fill me-2"></i>
          <span>Flat File</span>
        </button>
      </div>

      {/* Database Form Modal */}
      {dbModalIsOpen && (
        <Modal
          isOpen={dbModalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Add Database Config"
          className="modal-content bg-white rounded"
          overlayClassName="modal-overlay"
        >
          <div className="d-flex justify-content-between align-items-center pb-3">
            <h5 className="modal-title">Add {currentDb?.dbtype} Config</h5>
            <button type="button" className="btn-outline" onClick={closeModal}>
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
          <form>
            {currentDb?.config.map((field) => (
              <div key={field} className="form-group py-2">
                <label>{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formFields[field]}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
            ))}
          </form>
          <div className="text-start">
            <button
              type="button"
              className="m-2 p-2 px-4 mb-0 btn-green"
              onClick={handleFormSubmit}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
          {formSubmitStatus && <p className="mt-3 text-success">{formSubmitStatus}</p>}
        </Modal>
      )}

      {/* File Upload Modal */}
      {fileModalIsOpen && (
        <Modal
          isOpen={fileModalIsOpen}
          onRequestClose={closeFileModal}
          contentLabel="Upload Flat File"
          className="modal-content bg-white rounded"
          overlayClassName="modal-overlay"
        >
          <div className="d-flex justify-content-between align-items-center pb-3">
            <h5 className="modal-title">Upload Flat File</h5>
            <button type="button" className="btn-outline" onClick={closeFileModal}>
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
          <form>
            <div className="form-group py-2">
              <input
                type="file"
                className="form-control"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
              />
            </div>
          </form>
          <div className="text-start">
            <button
              type="button"
              className="m-2 p-2 px-4 mb-0 btn-green"
              onClick={handleSubmitFile}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Upload"
              )}
            </button>
          </div>
          {uploadStatus && <p className="mt-3 text-success">{uploadStatus}</p>}
        </Modal>
      )}
    </div>
  );
}

export default AddDataSource;
