import { useState } from 'react';
import WindowTemplate from "../components/WindowTemplate/WindowTemplate.jsx";
import Header from "../components/header/header.jsx";
import NoteEditor from "../components/NotePad/NoteEditor.jsx";
import NoteHistory from "../components/NotePad/NoteHistory.jsx";
import Background from '../components/Background/BackgroundImage.jsx';

function NotePad() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [newNote, setIsNewNote] = useState(false); // Initially, no new note

  const handleNoteSelect = (noteId) => {
    setSelectedNoteId(noteId); // Set the selected note ID when a note is clicked
  };

  const handleStartNewNote = () => {
    localStorage.removeItem('notesID'); // Clear sessionId
    setSelectedNoteId(null); // Deselect any note
    setIsNewNote(true); // Trigger a new chat
  };

  return (
    <Background>
      <div className="d-flex flex-column vh-100">
        <Header currentPage={"notepad"} />
        <WindowTemplate
          Maincontent={<NoteEditor selectedNoteId={selectedNoteId} newNote={newNote} resetNewChat={() => setIsNewNote(false)} />}
          sideBar={<NoteHistory onSelectNote={handleNoteSelect} newNote={handleStartNewNote} />}
        />
      </div>
    </Background>
  );
}

export default NotePad;
