import { useState } from 'react';
import WindowTemplate from "../components/WindowTemplate/WindowTemplate.jsx";
import Header from "../components/header/header.jsx";
import NoteEditor from "../components/NotePad/NoteEditor.jsx";
import NoteHistory from "../components/NotePad/NoteHistory.jsx";
import Background from '../components/Background/BackgroundImage.jsx';

function NotePad() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const handleNoteSelect = (noteId) => {
    setSelectedNoteId(noteId);
  };

  return (
    <Background>
      <div className="d-flex flex-column vh-100">
        <Header currentPage={"notepad"} />
        <WindowTemplate
          Maincontent={<NoteEditor selectedNoteId={selectedNoteId}/>}
          sideBar={<NoteHistory onSelectNote={handleNoteSelect}/>}
        />
      </div>
    </Background>
  );
}

export default NotePad;
