function ChatHeader() {

  const sessionID = localStorage.getItem('sessionId');
    return (
      <div>
        <div className="bg-white m-2 border p-2 rounded d-flex align-items-center justify-content-between">
          <p className="my-auto">Session ID: {sessionID} </p>
          <div className="dropdown">
            <button
              className="btn-outline dropdown-toggle p-2"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-database-fill"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>Need Endpoint</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  export default ChatHeader;
  