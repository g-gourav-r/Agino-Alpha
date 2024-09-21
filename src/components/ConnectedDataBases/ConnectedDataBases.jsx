import { useEffect, useState } from "react";
import createApiCall, { GET } from "../api/api.jsx";

function ConnectedDataSources() {
  const [connectedDataSources, setConnectedDataSources] = useState([]);

  const token = localStorage.getItem('token');
  
  const connectedDataSourcesApiCall = createApiCall("connecteddatabases", GET);

  useEffect(() => {
    connectedDataSourcesApiCall({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        if (data) {
          setConnectedDataSources(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching Connected Data Sources:", error);
      });
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <div className="m-2">
        <div className="text-center">
          <h6>Connected Data Sources</h6>
        </div>
      </div>
      <div
        className="text-white flex-grow-1 d-flex"
        style={{ height: "calc(100vh - 400px)", overflowY: "auto" }}
      >
        <div className="w-100">
          {connectedDataSources.map((source) => (
            <button
              key={source._id}
              className="btn-white m-2 ms-3"
              style={{ width: "90%" }}
              disabled
            >
              <div className="p-1 text-truncate text-start">
                {source.aliasName ? source.aliasName : source.database}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConnectedDataSources;
