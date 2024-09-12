import React, { useState } from 'react';
import WindowTemplate from "../components/WindowTemplate/WindowTemplate.jsx";
import Header from "../components/header/header.jsx";
import NoteEditor from "../components/NotePad/NoteEditor.jsx";
import NoteHistory from "../components/NotePad/NoteHistory.jsx";
import Background from '../components/Background/Background.jsx';

function NotePad() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const refreshNoteHistory = () => {
    setRefreshHistory(!refreshHistory); // Trigger history refresh
  };

  return (
    <Background>
      <div className="d-flex flex-column vh-100">
        <Header currentPage={"notepad"} />
        <WindowTemplate
          Maincontent={<NoteEditor selectedNote={selectedNote} refreshNoteHistory={refreshNoteHistory} />}
          sideBar={<NoteHistory setSelectedNote={setSelectedNote} refreshHistory={refreshHistory} />}
        />
      </div>
    </Background>
  );
}

export default NotePad;
