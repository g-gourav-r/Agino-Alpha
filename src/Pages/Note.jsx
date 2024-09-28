import { useState } from 'react';
import WindowTemplate from "../components/WindowTemplate/WindowTemplate.jsx";
import Header from "../components/header/header.jsx";
import NoteEditor from "../components/NotePad/NoteEditor.jsx";
import NoteHistory from "../components/NotePad/NoteHistory.jsx";
import Background from '../components/Background/BackgroundImage.jsx';

function NotePad() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [refreshChat, setRefreshNote] = useState(false);
  const [newChatTriggered, setNewChatTriggered] = useState(false);

  const handleStartNewChat = () => {
    setNewChatTriggered(true); // Set state to indicate a new chat has started
  };

  const handleRefreshNotes = () => {
    console.log("Refreshing notes...");
    setRefreshNote(true);
  };

  // Function to handle selecting a chat
  const onSelectChat = (chatId) => {
    console.log('Chat selected:', chatId);
  };

  const refreshNotes = () => {
    console.log("Refresh notes called");
  };

  return (
    <Background>
      <div className="d-flex flex-column vh-100">
        <Header currentPage={"notepad"} />
        <WindowTemplate
          Maincontent={
            <NoteEditor 
              selectedNote={selectedNote} 
              refreshNotes={refreshNotes}
              newChatTriggered={newChatTriggered}
            />}
          sideBar={
            <NoteHistory 
              setSelectedNote={setSelectedNote} 
              onStartNewChat={handleStartNewChat}
              onSelectChat={onSelectChat} // Pass the function here
              refreshNotes={refreshNotes}
            />
          }
        />
      </div>
    </Background>
  );
}

export default NotePad;
