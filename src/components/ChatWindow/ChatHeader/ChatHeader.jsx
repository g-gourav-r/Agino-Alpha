function ChatHeader() {
    return (
      <div>
        <div className="bg-white m-2 border p-2 rounded d-flex align-items-center justify-content-between">
          <h5 className="my-auto">Data Source (Need Endpoint)</h5>
          <div className="dropdown">
            <button
              className="btn-outline dropdown-toggle p-2"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-database-fill"></i>
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
  