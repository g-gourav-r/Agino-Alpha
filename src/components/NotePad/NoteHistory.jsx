import { useEffect, useState } from "react";
import createApiCall, { GET } from "../api/api";

function NoteHistory({onSelectNote, newNote }) {
  const [noteHistory, setNoteHistory] = useState([]);
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch note history when the component mounts
    const fetchNoteHistory = async () => {
      try {
        const noteHistoryApi = createApiCall("api/notes", GET);
        const response = await noteHistoryApi({
          headers: { Authorization: `Bearer ${token}` },
        });
        setNoteHistory(response.data);
        console.log(noteHistory);
      } catch (error) {
        console.error("Failed to fetch note history:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchNoteHistory();
  }, [token]);



  return (
    <div className="d-flex flex-column h-100">
      <div className="m-2">
        <button type="button" className="w-100 btn-green p-2" onClick={newNote}>
          Start a New Chat
        </button>
      </div>
      <div
        className="text-white flex-grow-1 d-flex"
        style={{ height: "calc(100vh - 400px)", overflowY: "auto" }}
      >
        <div className="w-100">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
              <div className="spinner-grow text-success" role="status">
                <span className="sr-only d-none">Loading...</span>
              </div>
            </div>
          ) : (
            noteHistory.length > 0 ? (
              noteHistory.map((chat) => (
                <button
                  key={chat._id}
                  className="btn-white m-2 ms-3"
                  style={{ width: "90%" }}
                  onClick={() => onSelectNote(chat._id)}
                >
                  <div className="p-1 text-truncate">{chat.title}</div>
                </button>
              ))
            ) : (
              <div className="text-center text-black">No notes available</div> // Show message if no notes are present
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteHistory;