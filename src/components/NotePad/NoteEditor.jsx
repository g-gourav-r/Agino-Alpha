import React, { useState, useRef, useEffect } from 'react';
import createApiCall, { POST, PUT } from '../api/api';
import Editor from './Editor'; // Assuming you have a custom Editor component

// Create the API call functions
const AddNoteApi = createApiCall("api/notes", POST);

const NoteEditor = ({ selectedNote, refreshNoteHistory }) => {
  const [editorHtml, setEditorHtml] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const editorRef = useRef(null);

  // Populate editor and title with the selected note
  useEffect(() => {
    if (selectedNote) {
      setNoteTitle(selectedNote.title);
      setEditorHtml(selectedNote.content);
      localStorage.setItem('notesID', selectedNote._id);
    }
  }, [selectedNote]);

  // Function to handle saving the note
  const saveNote = async () => {
    const notesID = localStorage.getItem('notesID');
    if (!notesID) {
      // Create a new note (POST)
      try {
        const response = await AddNoteApi({
          body: {
            title: noteTitle,
            content: editorHtml,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        localStorage.setItem('notesID', response.data._id);
        refreshNoteHistory(); // Refresh note history after save
      } catch (error) {
        console.error('Error saving note:', error);
      }
    } else {
      // Update existing note (PUT)
      try {
        const UpdateNoteApi = createApiCall(`api/notes/${notesID}`, PUT);
        const response = await UpdateNoteApi({

          body: {
            title: noteTitle,
            content: editorHtml,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        });
        refreshNoteHistory(); // Refresh note history after update
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  return (
    <div className='p-3 m-3 rounded bg-white border'>
      <div className="notepad-header d-flex">
        <input
          type="text"
          placeholder="Note Title"
          className="form-control me-2"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <button type="button" className="btn-green d-flex p-2" onClick={saveNote}>
          <i className="bi bi-floppy2-fill me-2"></i> Save
        </button>
      </div>
      <div className="input notepad-editor mt-3 h-100">
        <Editor
          value={editorHtml}
          onChange={(content) => setEditorHtml(content)}
          ref={editorRef}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
