import { useState } from 'react';
import WindowTemplate from "../components/WindowTemplate/WindowTemplate.jsx";
import Header from "../components/header/header.jsx";
import NoteEditor from "../components/NotePad/NoteEditor.jsx";
import NoteHistory from "../components/NotePad/NoteHistory.jsx";
import Background from '../components/Background/BackgroundImage.jsx';

function NotePad() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  // Function to handle starting a new chat
  const onStartNewChat = () => {
    setSelectedNote(null); // Reset selected note when starting a new chat
    refreshNoteHistory(); // Optionally refresh note history
  };

  // Function to handle selecting a chat
  const onSelectChat = (chatId) => {
    console.log('Chat selected:', chatId);
  };

  const refreshNoteHistory = () => {
    setRefreshHistory(!refreshHistory); // Trigger history refresh
  };

  return (
    <Background>
      <div className="d-flex flex-column vh-100">
        <Header currentPage={"notepad"} />
        <WindowTemplate
          Maincontent={<NoteEditor selectedNote={selectedNote} refreshNoteHistory={refreshNoteHistory} />}
          sideBar={
            <NoteHistory 
              setSelectedNote={setSelectedNote} 
              refreshHistory={refreshHistory} 
              onStartNewChat={onStartNewChat} 
              onSelectChat={onSelectChat} // Pass the function here
            />
          }
        />
      </div>
    </Background>
  );
}

export default NotePad;
