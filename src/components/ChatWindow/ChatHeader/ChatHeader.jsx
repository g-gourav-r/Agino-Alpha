import React, { useEffect, useState, useRef } from 'react';
import createApiCall from "../../api/api";

const getConnectedDB = createApiCall("connecteddatabases");

function ChatHeader({ onSelectDatabase, isChatFromHistory }) {
  const [connectedDatabases, setConnectedDatabases] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchConnectedDBs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getConnectedDB({
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response && response.data) {
          setConnectedDatabases(response.data);
        } else {
          setErrorMessage('Failed to fetch connected databases');
        }
      } catch (error) {
        console.error('Error fetching connected databases:', error);
        setErrorMessage(error.message || 'Failed to fetch connected databases');
      }
    };

    fetchConnectedDBs();
  }, []);

  const sessionID = localStorage.getItem('sessionId');

  const handleSelectDatabase = (db) => {
    setSelectedDatabase(db);
    onSelectDatabase(db);
  };

  return (
    <div>
      <div className="bg-white m-2 border px-2 rounded d-flex align-items-center justify-content-between">
        <p className="my-auto">Session ID: {sessionID}</p>
        <div className={`dropdown`} style={{ visibility: ( isChatFromHistory || localStorage.getItem("databaseAliasName") ) ? 'hidden' : 'visible', display : selectedDatabase ? 'none': 'block' }}>
        <button
            className="btn-outline dropdown-toggle p-2"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            disabled={isChatFromHistory}
          >
            <i className="bi bi-database-fill"></i>
          </button>
          <ul className={"dropdown-menu"} aria-labelledby="dropdownMenuButton1">
            {errorMessage && (
              <li className="dropdown-item text-danger">{errorMessage}</li>
            )}
            {!errorMessage && connectedDatabases.length > 0 ? (
              connectedDatabases.map((db, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSelectDatabase(db)}
                >
                  {db.aliasName}
                </li>
              ))
            ) : (
              <li className="dropdown-item">No connected databases</li>
            )}
          </ul>
        </div>

        {(selectedDatabase?.aliasName || localStorage.getItem("databaseAliasName")) && (
          <div className="p-2">
            <i className="bi bi-database-fill me-2"></i>
            {selectedDatabase?.aliasName || localStorage.getItem("databaseAliasName")}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
