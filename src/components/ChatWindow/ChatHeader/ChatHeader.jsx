import React, { useEffect, useState } from 'react';
import createApiCall from "../../api/api";

const getConnectedDB = createApiCall("connecteddatabases");

function ChatHeader({ onSelectDatabase, isChatFromHistory }) {
  const [connectedDatabases, setConnectedDatabases] = useState([]); // State to store connected databases
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState(null); // Track selected database

  useEffect(() => {
    const fetchConnectedDBs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getConnectedDB({
          headers: { 'Authorization': `Bearer ${token}` }, // Pass token in headers
        });

        if (response && response.data) {
          setConnectedDatabases(response.data); // Assuming the data structure contains the list
        } else {
          setErrorMessage('Failed to fetch connected databases');
        }
      } catch (error) {
        console.error('Error fetching connected databases:', error);
        setErrorMessage(error.message || 'Failed to fetch connected databases');
      }
    };

    fetchConnectedDBs();
  }, []); // Empty dependency array means this will run only once on mount

  const sessionID = localStorage.getItem('sessionId');

  // Handle selecting a database
  const handleSelectDatabase = (db) => {
    setSelectedDatabase(db); // Set the selected database
    onSelectDatabase(db); // Pass selected database to the parent component
  };

  return (
    <div>
      <div className="bg-white m-2 border px-2 rounded d-flex align-items-center justify-content-between">
        <p className="my-auto">Session ID: {sessionID}</p>

        <div className="dropdown">
          <button
            className="btn-outline dropdown-toggle p-2"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            disabled={isChatFromHistory} // Disable button if chat is from history
          >
            <i className="bi bi-database-fill"></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            {errorMessage && (
              <li className="dropdown-item text-danger">{errorMessage}</li>
            )}
            {!errorMessage && connectedDatabases.length > 0 ? (
              connectedDatabases.map((db, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSelectDatabase(db)} // Handle selecting a database
                >
                  {db.aliasName}
                </li>
              ))
            ) : (
              <li className="dropdown-item">No connected databases</li>
            )}
          </ul>
        </div>

        {/* Display selected database if available */}
        {selectedDatabase && (
          <div className="p-2">
            <i className="bi bi-database-fill me-2"></i>
            {selectedDatabase.database}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;