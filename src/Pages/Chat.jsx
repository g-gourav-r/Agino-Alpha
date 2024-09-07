import WindowTemplate from "../components/WindowTemplate/WindowTemplate";
import Background from "../components/background/background";
import Header from "../components/header/header";
import ChatHistory from "../components/chathistory/chathistory";
import ChatWindow from "../components/ChatWindow/ChatWindow";
import React, { useState } from 'react';




function Chat(){
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [isNewChat, setIsNewChat] = useState(false);

    // Function to start a new chat
    const handleStartNewChat = () => {
        localStorage.removeItem('sessionId'); // Clear sessionId
        setIsNewChat(true); // Trigger a new chat
    };
    const onSelectChat = (chatId) => {
        setSelectedChatId(chatId); // Set the selected chat ID
    };
    return (

        <Background>
        <div className="d-flex flex-column vh-100">
        <Header currentPage={"home"}/>
        <WindowTemplate
            sideBar={<ChatHistory onStartNewChat={handleStartNewChat}  onSelectChat={onSelectChat} />}
            Maincontent={<ChatWindow isNewChat={isNewChat} resetNewChat={() => setIsNewChat(false)} selectedChatId={selectedChatId}/>}
        />
        </div>
    </Background>

    );
}

export default Chat;