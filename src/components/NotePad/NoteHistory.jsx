import { useEffect, useState } from "react";
import createApiCall, { GET } from "../api/api";

function NoteHistory({ onStartNewChat, onSelectChat, setSelectedNote, refreshHistory }) {
  const [chatHistory, setNoteHistory] = useState([]);
  const token = localStorage.getItem('token');
  const NoteHistoryApiCall = createApiCall("api/notes", GET);

  useEffect(() => {
    NoteHistoryApiCall({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        if (data && data.status && data.data) {
          setNoteHistory(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
      });
  }, [refreshHistory]); // Trigger refresh when refreshHistory changes

  const handleStartNewChat = () => {
    localStorage.removeItem('notesID'); // Clear notesID from local storage
    onStartNewChat(); // Call the parent function to start a new chat
  };

  const handleSelectChat = (chat) => {
    setSelectedNote(chat); // Set the selected note
    localStorage.setItem('notesID', chat._id); // Update notesID in local storage
    onSelectChat(chat._id); // Call the parent function to select the chat
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="m-2">
        <button type="button" className="w-100 btn-green p-2" onClick={handleStartNewChat}>
          Start a New chat
        </button>
      </div>
      <div
        className="text-white flex-grow-1 d-flex"
        style={{ height: "calc(100vh - 400px)", overflowY: "auto" }}
      >
        <div className="w-100">
          {chatHistory.map((chat) => (
            <button
              key={chat._id}
              className="btn-white m-2 ms-3"
              style={{ width: "90%" }}
              onClick={() => handleSelectChat(chat)} // Handle chat selection
            >
              <div className="p-1 text-truncate">{chat.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteHistory;
