import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import createApiCall, { GET, POST } from "../api/api";

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
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleFileUpload = () => {
    setFileModalIsOpen(true);
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

    // Show loading spinner
    setLoading(true);

    // Make POST request to uploadSheet API
    const uploadApi = createApiCall("uploadSheet", POST);

    uploadApi({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: formData,
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
        setUploadStatus("Error uploading file.");
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
