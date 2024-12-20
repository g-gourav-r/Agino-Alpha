import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import MutatingDotsLoader from "../Loaders/MutatingDots.jsx";
import createApiCall, { GET, POST } from "../api/api.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHubspot, faShopify, faGoogle, faSalesforce, faFacebook } from '@fortawesome/free-brands-svg-icons';

// Set the app element for accessibility
Modal.setAppElement("#root");

function AddDataSource() {
  const [data, setData] = useState([]);
  const [enableAddDataBase, setDatabaseEnable] = useState(false);
  const [dataBaseFormFields, setdataBaseFormFields] = useState({});
  const [currentDb, setCurrentDb] = useState(null);
  const [formFields, setFormFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [addBtnVisible, setAddBtnVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileModalIsOpen, setFileModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dbModalIsOpen, setDbModalIsOpen] = useState(false);
  const [formSubmitStatus, setFormSubmitStatus] = useState("");
  const [inputsDisabled, setInputsDisabled] = useState(false); // New state for disabling inputs

  useEffect(() => {
    const AddDataSourceApi = createApiCall("databaseForm", GET);
    setLoading(true); // Set loading to true before the API call
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
      })
      .finally(() => {
        setLoading(false); // Ensure loading is set to false in finally block
      });
  }, []);

  const handleButtonClick = (db) => {
    setCurrentDb(db);
    setFormFields(
      db.config.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
    );
    setInputsDisabled(false); // Reset input state when opening modal
    setDbModalIsOpen(true); // Open the modal for DB form
  };

  const closeModal = () => {
    setDbModalIsOpen(false);
    setDatabaseEnable(false);
    setFormSubmitStatus(false);
    setInputsDisabled(false); // Reset input state on close
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
      dbtype: currentDb.dbtype,
    }));
  };

  const handleAddDataBase = () => {
    const SubmitDataBaseAPI = createApiCall("database", POST);
    dataBaseFormFields.schema = localStorage.getItem("schema");
    setLoading(true); // Set loading to true before the API call
    SubmitDataBaseAPI({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: dataBaseFormFields,
    })
      .then((response) => {
        if (response.status) {
          setFormSubmitStatus(response.message);
          localStorage.removeItem("schema");
        }
      })
      .catch((error) => {
        setFormSubmitStatus(error.message);
        localStorage.removeItem("schema");
        setDatabaseEnable(false);
      })
      .finally(() => {
        setLoading(false); // Reset loading state in finally block
      });
  };

  const handleFormSubmit = () => {
    const isFormValid = Object.values(formFields).every(
      (value) => value !== ""
    );
    if (!isFormValid) {
      setFormSubmitStatus("Please fill in all required fields.");
      return;
    }

    const submitApi = createApiCall("testConnection", POST);
    setLoading(true); // Set loading to true before the API call
    submitApi({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formFields,
    })
      .then((response) => {
        if (response.status) {
          localStorage.setItem("schema", JSON.stringify(response.table));
          setFormSubmitStatus(response.message);
          setDatabaseEnable(true);
          setdataBaseFormFields(formFields);
          setInputsDisabled(true); // Disable inputs on successful test
        } else {
          setFormSubmitStatus("Failed to submit the form.");
        }
      })
      .catch((error) => {
        setFormSubmitStatus("Error submitting the form.");
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        setLoading(false); // Reset loading state in finally block
      });
  };

  const handleFileUpload = () => {
    setFileModalIsOpen(true);
  };

  const closeFileModal = () => {
    setFileModalIsOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitFile = () => {
    closeFileModal();
    if (!file) {
      console.log("No file selected");
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // setLoading(true);
    // closeFileModal();
    const uploadFileToast = toast.loading("Uploading file..."); // Start loading toast

    const uploadApi = createApiCall("uploadSheet", POST);

    uploadApi({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => {
        closeFileModal()
        // setLoading(false);
        if (response.status) {
          toast.update(uploadFileToast, {
            render: "File uploaded successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000, // Auto close after 3 seconds
          });
        } else {
          toast.update(uploadFileToast, {
            render: "File upload failed.",
            type: "error",
            isLoading: false,
            autoClose: 3000, // Auto close after 3 seconds
          });
        }
      })
      .catch((error) => {
        // setLoading(false);
        toast.update(uploadFileToast, {
          render:
            "Error uploading file: " +
            (error.message || "An unknown error occurred."),
          type: "error",
          isLoading: false,
          autoClose: 3000, // Auto close after 3 seconds
        });
        console.error("Error uploading file:", error);
      });
  };

  return (
    <>
      {loading ? (
        <>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100%" }}
          >
            <MutatingDotsLoader />
          </div>
        </>
      ) : (
        <div>
        <ToastContainer />
          <h4 className="ms-4 p-4 text-secondary">Add Data Base</h4>
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
          <h4 className="ms-4 p-4 text-secondary">Integrate Data Source</h4>
          <div className="mx-4 px-4 d-flex flex-wrap">
              <button
                className="d-flex align-items-center btn-green-outline p-2 m-2"
                style={{ width: "200px", height: "50px" }}
              >
                <FontAwesomeIcon icon={faShopify} className="me-2"/>Shopify
              </button>
              <button
                className="d-flex align-items-center btn-green-outline p-2 m-2"
                style={{ width: "200px", height: "50px" }}
              >
                <FontAwesomeIcon icon={faHubspot} className="me-2" />
                HubSpot
              </button>
              <button
                className="d-flex align-items-center btn-green-outline p-2 m-2"
                style={{ width: "200px", height: "50px" }}
              >
                <FontAwesomeIcon icon={faGoogle} className="me-2"/>Google Analytics
              </button>
              <button
                className="d-flex align-items-center btn-green-outline p-2 m-2"
                style={{ width: "200px", height: "50px" }}
              >
                  <FontAwesomeIcon icon={faSalesforce} className="me-2"/>SalesForce
              </button>
              <button
                className="d-flex align-items-center btn-green-outline p-2 m-2"
                style={{ width: "200px", height: "50px" }}
              >
                  <FontAwesomeIcon icon={faFacebook} className="me-2"/>Facebook Pixel
              </button>
          </div>
          <h4 className="ms-4 p-4 text-secondary">Upload Flat File</h4>
          <FontAwesomeIcon icon="fa-solid fa-check-square" />
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
                <button
                  type="button"
                  className="btn-outline"
                  onClick={closeModal}
                >
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
                      disabled={inputsDisabled} // Disable input based on state
                    />
                  </div>
                ))}
              </form>
              <div className="text-start">
                {!enableAddDataBase && (
                  <button
                    type="button"
                    className="my-2 me-3 p-2 px-4 mb-0 btn-green"
                    onClick={handleFormSubmit}
                    disabled={loading} // Optionally disable the button while loading
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Test Connection"
                    )}
                  </button>
                )}
                {enableAddDataBase && (
                  <button
                    type="button"
                    className="my-2 p-2 px-4 mb-0 btn-green"
                    onClick={handleAddDataBase}
                    disabled={loading} // Optionally disable while loading
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Add Database"
                    )}
                  </button>
                )}
              </div>
              {formSubmitStatus && (
                <div className="alert alert-info mt-2" role="alert">
                  {formSubmitStatus}
                </div>
              )}
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
                <button
                  type="button"
                  className="btn-outline"
                  onClick={closeFileModal}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              </div>
              <form>
                <input
                  type="file"
                  accept=".csv, .xls, .xlsx"
                  onChange={(e) => {
                    handleFileChange(e); // Call handleFileChange with the event
                    localStorage.removeItem("sessionId");
                    localStorage.removeItem("database");
                    localStorage.removeItem("databaseAliasName");
                  }}
                  className="form-control"
                  required
                />
              </form>
              <div className="text-start">
                <button
                  type="button"
                  className="my-2 p-2 px-4 mb-0 btn-green"
                  onClick={handleSubmitFile}
                  disabled={loading} // Optionally disable while loading
                >
                  Upload
                </button>
              </div>
            </Modal>
          )}
        </div>
      )}
    </>
  );
}

export default AddDataSource;
