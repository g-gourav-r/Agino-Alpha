import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import createApiCall, { POST } from "../api/api";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const getGraphData = createApiCall("graphData", POST);

const DatabaseTable = ({ DB_response, ChatLogId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFirstHeader, setSelectedFirstHeader] = useState("");
  const [selectedSecondHeader, setSelectedSecondHeader] = useState("");
  const [graphData, setGraphData] = useState(null); // Store API graph data
  const [graphType, setGraphType] = useState("line"); // Store selected graph type (default: line)
  const rowsPerPage = 5;

  if (!DB_response || DB_response.length === 0) return null;

  const headers = Object.keys(DB_response[0]);

  // Calculate total pages
  const totalPages = Math.ceil(DB_response.length / rowsPerPage);

  // Get the data for the current page
  const currentRows = DB_response.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const scrollableContainerStyle = {
    overflowX: "auto",
    width: "100%",
    marginTop: "1rem",
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Open modal for graph generation
  const handleGenerateGraph = () => {
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFirstHeader(""); // Reset selections when modal closes
    setSelectedSecondHeader("");
  };

  // Handle the graph generation after selecting dropdowns
  const handleGenerateGraphSubmit = () => {
    const token = localStorage.getItem("token"); // Ensure 'token' is the correct key

    const requestData = {
      xaxis: selectedFirstHeader,
      yaxis1: selectedSecondHeader,
      chatLogId: ChatLogId,
    };

    getGraphData({
      body: requestData, // Body with the xaxis and yaxis data
      headers: {
        Authorization: `Bearer ${token}`, // JWT in Authorization header
      },
    })
      .then((response) => {
        const { data } = response;
        if (data && data.labels && data.datasets) {
          // Ensure there's valid data before setting it
          const hasValidData = data.labels.some(label => label !== null) && data.datasets.some(dataset => dataset.data.some(point => point !== null));
          
          if (hasValidData) {
            setGraphData(data); // Set valid graph data
          } else {
            alert("Cannot generate graph: No valid data returned.");
          }
        } else {
          alert("Error: Invalid data format returned from the API.");
        }
      })
      .catch((error) => {
        console.error("Error generating graph:", error);
      });

    // Close the modal after submission
    handleCloseModal();
  };

  // Options for Chart.js
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Generated Graph",
      },
    },
  };

  // Dropdown to select graph type
  const handleGraphTypeChange = (e) => {
    setGraphType(e.target.value);
  };

  // Copy graph to clipboard
  const handleCopyGraph = () => {
    const graphElement = document.getElementById("graph-container");
    html2canvas(graphElement).then((canvas) => {
      canvas.toBlob((blob) => {
        navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        alert("Graph copied to clipboard!");
      });
    });
  };

  return (
    <>
      <div style={scrollableContainerStyle}>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              {headers.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr key={index}>
                {headers.map((key) => (
                  <td key={key}>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link text-black"
                onClick={() => handlePageChange(1)}
                aria-label="First"
              >
                <span aria-hidden="true">&laquo;&laquo;</span>
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link text-black"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link text-black"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link text-black"
                onClick={() => handlePageChange(totalPages)}
                aria-label="Last"
              >
                <span aria-hidden="true">&raquo;&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Generate Graph Button */}
      <div className="mx-4">
        <button
          className="btn-black p-2 mt-4 w-100"
          onClick={handleGenerateGraph}
        >
          <i className="bi bi-download me-2 p-2"></i>Generate Graph
        </button>
      </div>

      {/* Modal for Graph Generation */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Generate Graph</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Dropdown for first header */}
                <div className="form-group">
                  <label htmlFor="first-header-select">Select X-axis</label>
                  <select
                    className="form-control"
                    id="first-header-select"
                    value={selectedFirstHeader}
                    onChange={(e) => setSelectedFirstHeader(e.target.value)}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown for second header */}
                <div className="form-group mt-3">
                  <label htmlFor="second-header-select">Select Y-axis</label>
                  <select
                    className="form-control"
                    id="second-header-select"
                    value={selectedSecondHeader}
                    onChange={(e) => setSelectedSecondHeader(e.target.value)}
                    disabled={!selectedFirstHeader}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {headers
                      .filter((header) => header !== selectedFirstHeader)
                      .map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Dropdown for graph type */}
                <div className="form-group mt-3">
                  <label htmlFor="graph-type-select">Select Graph Type</label>
                  <select
                    className="form-control"
                    id="graph-type-select"
                    value={graphType}
                    onChange={handleGraphTypeChange}
                  >
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateGraphSubmit}
                  disabled={!selectedFirstHeader || !selectedSecondHeader}
                >
                  Generate
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Chart.js Graph */}
      {graphData && (
        <div id="graph-container" className="mt-5">
          {graphType === "line" && (
            <Line
              data={{
                labels: graphData.labels,
                datasets: graphData.datasets,
              }}
              options={chartOptions}
            />
          )}
          {graphType === "bar" && (
            <Bar
              data={{
                labels: graphData.labels,
                datasets: graphData.datasets,
              }}
              options={chartOptions}
            />
          )}
        </div>
      )}

      {/* Copy Graph Button */}
      {graphData && (
        <div className="mx-4 mt-4">
          <button className="btn btn-secondary w-100" onClick={handleCopyGraph}>
            <i className="bi bi-clipboard me-2"></i>Copy Graph
          </button>
        </div>
      )}
    </>
  );
};

export default DatabaseTable;