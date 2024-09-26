import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import createApiCall, { POST, GET } from "../api/api.jsx";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const getGraphData = createApiCall("graphData", POST);
const downloadReportApi = createApiCall("getSheet", GET);

const DatabaseTable = ({ DB_response, ChatLogId, handleShare }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFirstHeader, setSelectedFirstHeader] = useState("");
  const [selectedSecondHeader, setSelectedSecondHeader] = useState("");
  const [selectedSecondYHeader, setSelectedSecondYHeader] = useState(""); // New state for Y2 header
  const [graphData, setGraphData] = useState(null);
  const [graphType, setGraphType] = useState("line");
  const rowsPerPage = 5;

  if (!DB_response || DB_response.length === 0) return null;

  const headers = Object.keys(DB_response[0]);
  const totalPages = Math.ceil(DB_response.length / rowsPerPage);
  const currentRows = DB_response.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
  const scrollableContainerStyle = {
    overflowX: "auto",
    width: "100%",
    marginTop: "1rem",
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleGenerateGraph = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFirstHeader("");
    setSelectedSecondHeader("");
    setSelectedSecondYHeader(""); // Reset second Y header on close
  };

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await downloadReportApi({
        urlParams: { chatLogId : ChatLogId },
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      console.log('Download response:', response);
  
      if (response && response.url) {
        window.open(response.url, '_blank');
      } else {
        console.error("No URL found in the response.");
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleGenerateGraphSubmit = () => {
    const token = localStorage.getItem("token");
    
    const requestData = {
      xaxis: selectedFirstHeader,
      yaxis1: selectedSecondHeader,
      yaxis2: selectedSecondYHeader, // Include the second Y-axis
      chatLogId: ChatLogId,
    };

    getGraphData({
      body: requestData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const { data } = response;
        if (data && data.labels && data.datasets) {
          const hasValidData = data.labels.some(label => label !== null) && data.datasets.some(dataset => dataset.data.some(point => point !== null));
          
          if (hasValidData) {
            setGraphData(data);
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

    handleCloseModal();
  };

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

  const handleGraphTypeChange = (e) => {
    setGraphType(e.target.value);
  };

  const handleCopyGraph = () => {
    const graphElement = document.getElementById("graph-container");
    html2canvas(graphElement).then((canvas) => {
      canvas.toBlob((blob) => {
        navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        alert("Graph copied to clipboard!");
      });
    });
  };

  return (
    <>
      <div style={scrollableContainerStyle}>
        <table className="table table-bordered table-hover">
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
              <button className="page-link text-black" onClick={() => handlePageChange(1)} aria-label="First">
                <span aria-hidden="true">&laquo;&laquo;</span>
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link text-black" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link text-black" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link text-black" onClick={() => handlePageChange(totalPages)} aria-label="Last">
                <span aria-hidden="true">&raquo;&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Display the graph */}
      <div id="graph-container" className="p-1">
        {graphData && (
          graphType === "line" ? (
            <Line data={graphData} options={chartOptions} />
          ) : (
            <Bar data={graphData} options={chartOptions} />
          )
        )}
      </div>

      {/* Generate Graph Button */}
      <div className="d-flex mt-1 mx-2">
        <button className="btn-black btn-sm px-1 me-2 d-flex align-items-center" onClick={handleGenerateGraph}>
          <i className="bi bi-bar-chart me-2"></i>Generate Graph
        </button>
        <button className="btn-black btn-sm p-1 me-2 d-flex align-items-center" onClick={handleDownload}>
          <i className="bi bi-download me-2"></i>Download Report
        </button>
        <button className="btn-black btn-sm p-1 me-2 d-flex align-items-center" onClick={handleShare}>
          <i className="bi bi-share me-2"></i>Share Report
        </button>
        {graphData && (
          <button className="btn-black btn-sm p-1 d-flex align-items-center" onClick={handleCopyGraph}>
            <i class="bi bi-copy"></i> Copy Graph
          </button>
        )}
      </div>

      {/* Modal for Graph Generation */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Generate Graph</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {/* Dropdown for first header */}
                <div className="form-group">
                  <label htmlFor="first-header-select">Select X-axis</label>
                  <select className="form-control" id="first-header-select" value={selectedFirstHeader} onChange={(e) => setSelectedFirstHeader(e.target.value)}>
                    <option value="">Select...</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
                {/* Dropdown for second header */}
                <div className="form-group">
                  <label htmlFor="second-header-select">Select Y-axis</label>
                  <select className="form-control" id="second-header-select" value={selectedSecondHeader} onChange={(e) => setSelectedSecondHeader(e.target.value)}>
                    <option value="">Select...</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
                {/* Dropdown for second Y-axis */}
                <div className="form-group">
                  <label htmlFor="second-y-header-select">Select Second Y-axis</label>
                  <select className="form-control" id="second-y-header-select" value={selectedSecondYHeader} onChange={(e) => setSelectedSecondYHeader(e.target.value)}>
                    <option value="">Select...</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
                {/* Dropdown for graph type */}
                <div className="form-group">
                  <label htmlFor="graph-type-select">Select Graph Type</label>
                  <select className="form-control" id="graph-type-select" value={graphType} onChange={handleGraphTypeChange}>
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleGenerateGraphSubmit}>Generate Graph</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DatabaseTable;
