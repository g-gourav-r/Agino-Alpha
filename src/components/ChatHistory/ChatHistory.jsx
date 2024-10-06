import { useEffect, useState } from "react";
import createApiCall, { GET } from "../api/api.jsx";
import MutatuingDotsLoader from "../Loaders/MutatingDots.jsx";

function ChatHistory({ onStartNewChat, onSelectChat }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  const token = localStorage.getItem('token');
  
  const ChatHistoryApiCall = createApiCall("chatHistory", GET);

  useEffect(() => {
    setLoading(true); // Start loading
    ChatHistoryApiCall({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        // Check if the response has 'data' field
        if (data && data.status && data.data) {
          setChatHistory(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after API call
      });
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <div className="m-2">
        <button type="button" className="w-100 btn-green p-2" onClick={onStartNewChat}>
          Start a New chat
        </button>
      </div>
      <div
        className="text-white flex-grow-1 d-flex"
        style={{ height: "calc(100vh - 400px)", overflowY: "auto" }}
      >
        <div className="w-100">
          {loading ? ( // Show loader if loading
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
              <MutatuingDotsLoader/>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <button
                key={chat._id}
                className="btn-white m-2 ms-3"
                style={{ width: "90%" }}
                value={chat._id}
                onClick={() => { onSelectChat(chat._id); localStorage.setItem("history", true); localStorage.removeItem("database"); localStorage.removeItem("databaseAliasName")}}
              >
                <div className="p-1 text-truncate text-start">
                  {chat.input} <br />
                  <span style={{ fontSize: "0.6rem", color: "#6c757d" }}>
                    {new Date(chat.startTime).toLocaleString()}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;
