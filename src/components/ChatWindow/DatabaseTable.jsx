import React, { useState } from "react";

const DatabaseTable = ({ DB_response }) => {
  if (!DB_response || DB_response.length === 0) return null;

  const headers = Object.keys(DB_response[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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
                className="page-link text-black text-black"
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
    </>
  );
};

export default DatabaseTable;
