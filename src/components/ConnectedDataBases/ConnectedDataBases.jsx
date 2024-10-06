import { useEffect, useState } from "react";
import createApiCall, { GET } from "../api/api.jsx";
import MutatingDotsLoader from "../Loaders/MutatingDots.jsx";

function ConnectedDataSources() {
  const [connectedDataSources, setConnectedDataSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  
  const connectedDataSourcesApiCall = createApiCall("connecteddatabases", GET);

  useEffect(() => {
    const fetchConnectedDataSources = async () => {
      setLoading(true);
      try {
        const data = await connectedDataSourcesApiCall({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data) {
          setConnectedDataSources(data.data);
        }
      } catch (error) {
        console.error("Error fetching Connected Data Sources:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after the API call
      }
    };

    fetchConnectedDataSources();
  }, [token]); // Optionally include token if it may change

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
        {loading ?  
        (
          <div className="d-flex justify-content-center align-items-center mx-auto" style={{ height: "100%" }}>
            <MutatingDotsLoader/>
          </div>
        ) :
        (
          <div className="w-100">
            {connectedDataSources.length > 0 ? (
              connectedDataSources.map((source) => (
                <button
                  key={source._id}
                  className="btn-white m-2 ms-3"
                  style={{ width: "90%" }}
                  disabled // This button is disabled, you may want to remove this if it's intentional
                >
                  <div className="p-1 text-truncate text-start">
                    {source.aliasName ? source.aliasName : source.database}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center text-black">No connected data sources found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectedDataSources;
