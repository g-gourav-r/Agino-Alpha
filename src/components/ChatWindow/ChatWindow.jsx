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
    const getChatHistoryApi = createApiCall("chatlogBySessionId", GET);

    useEffect(() => {
        if (isNewChat) {
            setMessages([]);
            localStorage.removeItem('sessionId');
            resetNewChat();
        }
    }, [isNewChat, resetNewChat]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (selectedChatId) {
                const token = localStorage.getItem('token');
                
                try {
                    const response = await getChatHistoryApi({
                        urlParams: { sessionId: selectedChatId },
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response && response.data) {
                        localStorage.setItem('sessionId', selectedChatId);

                        const newMessages = response.data.map((chat) => [
                            {
                                id: chat._id + "_human",
                                sender: "human",
                                message: chat.message[0].human
                            },
                            {
                                id: chat._id + "_ai",
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
                                                <DatabaseTable DB_response={chat.context.DB_response} ChatLogId={chat._id} />
                                            </div>
                                        )}
                                        {chat.context.followup.length > 0 && (
                                            <FollowupButtons followups={chat.context.followup} onFollowupClick={handleFollowupClick} />
                                        )}
                                    </div>
                                )
                            }
                        ]).flat();

                        setMessages(newMessages);
                    } else {
                        console.error('No chat history found.');
                    }
                } catch (error) {
                    console.error('Error fetching chat history:', error);
                }
            }
        };
    
        fetchChatHistory();
    }, [selectedChatId]);

    useEffect(() => {
        if (chatContentRef.current) {
            const lastHumanMessage = [...chatContentRef.current.children]
                .reverse()
                .find(child => child.classList.contains('chat-bubble') && child.classList.contains('human'));

            if (lastHumanMessage) {
                chatContentRef.current.scrollTop = lastHumanMessage.offsetTop - 100;
            } else {
                // If no human message is found, scroll to the bottom
                chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = async (messageToSend) => {
        if (!messageToSend.trim()) return;

        const currentSessionId = localStorage.getItem("sessionId");
        const token = localStorage.getItem("token");

        const userMessage = {
            id: Date.now(),
            sender: "human",
            message: messageToSend,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        const placeholderMessage = {
            id: Date.now() + 1,
            sender: "ai",
            message: "Loading...",
            loading: true,
        };
        setMessages((prevMessages) => [...prevMessages, placeholderMessage]);

        setNewMessage("");
        setLoadingMessageId(placeholderMessage.id);
        setErrorMessage("");

        try {
            const data = await newMessageApi({
                body: {
                    email: localStorage.getItem('email'),
                    psid: localStorage.getItem('psid'),
                    message: messageToSend,
                    database: "classicmodels",
                    newSession: !currentSessionId,
                    sessionId: currentSessionId || undefined,
                },
                headers: { 'Authorization': `Bearer ${token}` },
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

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === placeholderMessage.id
                        ? {
                            ...msg,
                            message: (
                                <div className="message-content">
                                    {agent && <div className="py-1">{agent}</div>}
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

            const errorMessage = error?.message || 'An unknown error occurred';

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

            setErrorMessage(errorMessage);
        } finally {
            setLoadingMessageId(null);
        }
    };

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
