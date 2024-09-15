import { useState, useEffect, useRef } from 'react';
import ChatHeader from "./ChatHeader/ChatHeader.jsx";
import ChatInput from "./ChatInput/ChatInput.jsx";
import CodeEditor from './CodeEditor.jsx'; 
import DatabaseTable from './DatabaseTable.jsx';
import FollowupButtons from './FollowupButtons.jsx';
import createApiCall, { POST, GET } from '../api/api.jsx';

function ChatWindow({ isNewChat, resetNewChat, selectedChatId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingMessageId, setLoadingMessageId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const chatContentRef = useRef(null);

    const newMessageApi = createApiCall("newMessage", POST);
    const downloadReportApi = createApiCall("getSheet", GET);
    const getChatHistoryApi = createApiCall("chatlogBySessionId", GET);

    // Reset chat when a new chat is started
    useEffect(() => {
        if (isNewChat) {
            setMessages([]); // Clear previous messages
            localStorage.removeItem('sessionId'); // Ensure sessionId is cleared
            resetNewChat(); // Reset the flag after the chat is cleared
        }
    }, [isNewChat, resetNewChat]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (selectedChatId) {
                const token = localStorage.getItem('token');
                
                try {
                    const response = await getChatHistoryApi({
                        urlParams: { sessionId: selectedChatId }, // Pass selectedChatId as sessionId
                        headers: {
                            'Authorization': `Bearer ${token}` // Add token for authentication
                        }
                    });

                    if (response && response.data) {
                        // Save the new sessionId in localStorage
                        localStorage.setItem('sessionId', selectedChatId);

                        // Map through the data to set messages
                        const newMessages = response.data.map((chat) => {
                            return [
                                {
                                    id: chat._id + "_human", // Unique id for each message
                                    sender: "human",
                                    message: chat.message[0].human
                                },
                                {
                                    id: chat._id + "_ai", // Unique id for each message
                                    sender: "ai",
                                    message: (
                                        <div className="message-content">
                                            <div>{chat.context.agent}</div>
                                            {chat.context.SQL_query && (
                                                <div className="code-editor-container my-1">
                                                    <CodeEditor SQL_query={chat.context.SQL_query} />
                                                </div>
                                            )}
                                            {chat.context.query_description && (
                                                <div className="query-description my-1">
                                                    <p>{chat.context.query_description}</p>
                                                </div>
                                            )}
                                            {chat.context.DB_response && (
                                                <div className="database-table-container">
                                                    <DatabaseTable   DB_response={chat.context.DB_response} ChatLogId={chat._id}  />
                                                </div>
                                            )}
                                            {chat.context.followup.length > 0 && (
                                                <FollowupButtons followups={chat.context.followup} onFollowupClick={handleFollowupClick} />
                                            )}
                                        </div>
                                    )
                                }
                            ];
                        }).flat(); // Flatten the array to have individual message objects

                        // Update the messages state with the new messages
                        setMessages(newMessages);
                    } else {
                        console.error('No chat history found.');
                    }
                } catch (error) {
                    console.error('Error fetching chat history:', error);
                }
            }
        };
    
        fetchChatHistory(); // Call the async function
    }, [selectedChatId]); // Ensure `getChatHistoryApi` is not a dependency

    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleDownload = async (chatLogId) => {
        const token = localStorage.getItem('token'); 
    
        try {
            const response = await downloadReportApi({
                urlParams: { chatLogId },  
                headers: {
                    'Authorization': `Bearer ${token}`,  
                },
            });

            if (response && response.url) {
                window.open(response.url, '_blank');
            } else {
                console.error("No URL found in the response.");
            }    
        } catch (error) {
            console.error('Error downloading report:', error);
            setErrorMessage(error.message || 'Failed to download report');
        }
    };

    const handleSend = async (messageToSend) => {
        if (!messageToSend.trim()) return;

        const currentSessionId = localStorage.getItem("sessionId");
        const token = localStorage.getItem("token");

        // Add user's message to the chat
        const userMessage = {
            id: Date.now(),
            sender: "human",
            message: messageToSend,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Add placeholder message for API response
        const placeholderMessage = {
            id: Date.now() + 1,
            sender: "ai",
            message: "Loading...",
            loading: true,
        };
        setMessages((prevMessages) => [...prevMessages, placeholderMessage]);

        setNewMessage("");
        setLoadingMessageId(placeholderMessage.id);
        setErrorMessage("");  // Reset error message

        try {
            // Make API request
            const data = await newMessageApi({
                body: {
                    email: localStorage.getItem('email'),
                    psid: localStorage.getItem('psid'),
                    message: messageToSend,
                    database: "classicmodels",
                    newSession: !currentSessionId,
                    sessionId: currentSessionId || undefined,
                },
                headers: {
                    'Authorization': `Bearer ${token}`,  // Add the Authorization header
                },
            });

            const {
                agent = "",
                query_description = "",
                followup = [],
                SQL_query = "",
                DB_response = [],
                sessionId = null,
                chatLogId = null
            } = data;

            if (sessionId) {
                localStorage.setItem("sessionId", sessionId);
            }

            // Update messages state
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === placeholderMessage.id
                        ? {
                            ...msg,
                            message: (
                                <div className="message-content">
                                    {agent && <div className="my-2">{agent}</div>}
                                    {SQL_query && (
                                        <div className="code-editor-container my-1">
                                            <CodeEditor SQL_query={SQL_query} />
                                        </div>
                                    )}
                                    {query_description && (
                                        <div className="query-description my-1">
                                            <p>{query_description}</p>
                                        </div>
                                    )}
                                    <div className="database-table-container">
                                        <DatabaseTable DB_response={DB_response} ChatLogId={chatLogId} />
                                    </div>
                                    {(SQL_query && DB_response.length > 0) && (
                                        <div className="mx-4">
                                            <button
                                                className="btn-black p-2 mt-1 w-100"
                                                onClick={() => handleDownload(chatLogId)}
                                            >
                                                <i className="bi bi-download me-2 p-2"></i>Download Report
                                            </button>
                                        </div>
                                    )}
                                    {followup.length > 0 && (
                                        <FollowupButtons followups={followup} onFollowupClick={handleFollowupClick} />
                                    )}
                                </div>
                            ),
                            loading: false,
                        }
                        : msg
                )
            );
        } catch (error) {
            console.error("Error sending message:", error);

            // Extract the error message
            const errorMessage = error?.message || 'An unknown error occurred';

            // Update messages state to show error
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === placeholderMessage.id
                        ? {
                            ...msg,
                            message: (
                                <div className="message-content">
                                    <p className="text-danger">Error: {errorMessage}</p>
                                </div>
                            ),
                            loading: false,
                        }
                        : msg
                )
            );

            setErrorMessage(errorMessage);  // Set the error message state
        } finally {
            setLoadingMessageId(null);
        }
    };

    // Define handleFollowupClick
    const handleFollowupClick = (followupId) => {
        handleSend(followupId);
    };

    return (
        <div className="d-flex flex-column h-100">
            <div className="flex-shrink-0">
                <ChatHeader />
            </div>
            <div
                className="chat-content flex-grow-1 overflow-auto p-3 mx-2"
                style={{ height: 'calc(100vh - 400px)', overflowY: 'auto' }}
                ref={chatContentRef}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-bubble ${msg.sender}`}
                        style={{ textAlign: msg.sender === 'human' ? 'right' : 'left' }}
                    >
                        {msg.message}
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 mb-2">
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
}

export default ChatWindow;
