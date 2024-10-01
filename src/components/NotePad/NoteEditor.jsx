import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Gapcursor from "@tiptap/extension-gapcursor";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import React, { useState, useRef, useEffect } from "react";
import Dropcursor from "@tiptap/extension-dropcursor";
import createApiCall, { POST, PUT, GET } from "../api/api";

// Additional component or function definitions go here

const NoteEditor = ({ selectedNoteId, newNote, resetNewChat }) => {
  const [notesData, setNotesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [notesTitle, setNoteTitle] = useState("");
  const [oldNoteData, setOldNoteData] = useState("");
  const [fullPageLoader, setFullPageLoader] = useState(false);

  useEffect(() => {
    const fetchNoteContent = async (noteId) => {
      setFullPageLoader(true);
      const token = localStorage.getItem("token");

      try {
        const fetchNoteContentApi = createApiCall(`api/notes/${noteId}`);
        const response = await fetchNoteContentApi({
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response);

        if (response.status) {
          const content = JSON.parse(response.data.content); // Parse if needed
          console.log("Content:", content);
          setOldNoteData(content);
          setNoteTitle(response.data.title);
        } else {
          console.error("Failed to fetch note content:", response.message);
        }
      } catch (error) {
        console.error("Error fetching note content:", error);
      } finally {
        setFullPageLoader(false); // Stop loading after fetch attempt
      }
    };

    // Select either the provided selectedNoteId or the ID from localStorage
    const notesIdFromStorage = localStorage.getItem("notesID");
    const noteIdToFetch = selectedNoteId || notesIdFromStorage;

    if (noteIdToFetch) {
      localStorage.setItem("notesID", noteIdToFetch); // Update localStorage with selected ID
      fetchNoteContent(noteIdToFetch);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    if (newNote) {
      editor.commands.setContent("");
      setNoteTitle("");
    }
  }, [newNote, resetNewChat]);

  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Document,
      Paragraph,
      Text,
      Gapcursor,
      ImageResize,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Dropcursor,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: fileReader.result, // Base64 string
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            // Ensure it's an image
            if (!file.type.startsWith("image/")) return;

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result, // Base64 string
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
    content: `Agino`,
    onUpdate: ({ editor }) => {
      setNotesData(editor.getJSON());
    },
  });

  const handleDownload = () => {
    const content = editor.getHTML(); // You can also use getJSON() for structure

    // Create a temporary container to store the editor's content
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;
    document.body.appendChild(tempContainer); // Append it to the document to render styles
  
    // Use html2pdf to convert the temporary container to a PDF
    const options = {
      margin: 1,
      filename: notesTitle,
      html2canvas: { scale: 2 },  // Use a higher scale for better resolution
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
  
    html2pdf()
      .from(tempContainer) // Convert the container to PDF
      .set(options)
      .save()  // Trigger the download
      .then(() => {
        document.body.removeChild(tempContainer); // Clean up after the PDF is generated
      });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const notesID = localStorage.getItem("notesID");
    setLoading(true);

    //Sanitize the data
    if (notesTitle.length == 0 || notesData.length == 0) {
      setLoading(false);
      alert("Both title and notes are mandatory to save the notes");
      return;
    }

    try {
      if (notesID) {
        // Update existing note
        const updateNoteApi = createApiCall(`api/notes/${notesID}`, PUT);
        const response = await updateNoteApi({
          headers: { Authorization: `Bearer ${token}` },
          body: {
            title: notesTitle,
            content: JSON.stringify(notesData),
          },
        });

        console.log("Note updated:", response);
      } else {
        // Add new note
        const addNewNoteApi = createApiCall("api/notes", POST);
        const response = await addNewNoteApi({
          headers: { Authorization: `Bearer ${token}` },
          body: {
            title: notesTitle,
            content: JSON.stringify(notesData),
          },
        });

        console.log("New note added:", response);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false); // Set loader to false after operation is complete
    }
  };

  if (!editor) {
    return null;
  }
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(oldNoteData);
    }
  }, [oldNoteData, editor]);

  return (
    <>
      {fullPageLoader ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center mx-auto"
          style={{ height: "100%" }}
        >
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only d-none">Loading...</span>
          </div>
          <br />
          <p className="text-muted ml-3">Loading</p>
        </div>
      ) : (
        <>
          {/* Input bar */}
          <div className="notepad-header d-flex mx-2 mt-2">
            <input
              type="text"
              placeholder="Note Title"
              className="form-control me-2"
              value={notesTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <button
              type="button"
              className="btn-green d-flex p-2 me-2"
              onClick={handleSave}
            >
              {loading ? (
                <div className="spinner-grow text-success" role="status">
                  <span className="sr-only d-none">Loading...</span>
                </div>
              ) : (
                <>
                  <i className="bi bi-floppy2-fill me-2"></i> Save
                </>
              )}
            </button>
            <button type="button" className="btn-green d-flex p-2 me-2">
              <i className="bi bi-share me-2"></i> Share
            </button>
            <button type="button" className="btn-green d-flex p-2" onClick={handleDownload}>
              <i className="bi bi-download me-2"></i> Download
            </button>
          </div>

          {/* Buttons */}
          <div className="control-group border bg-white m-1 rounded">
            <div className="button-group d-flex align-items-center justify-content-center mx-auto pt-1">
              {/* Text Formatting Buttons */}
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`btn-menu ${
                  editor.isActive("bold") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-type-bold"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`btn-menu ${
                  editor.isActive("italic") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-type-italic"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`btn-menu ${
                  editor.isActive("strike") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-type-strikethrough"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={`btn-menu ${
                  editor.isActive("code") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-code-slash"></i>
              </button>

              {/* Heading and List Buttons */}
              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`btn-menu ${
                  editor.isActive("paragraph") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-text-paragraph"></i>
              </button>
              {[...Array(6)].map((_, i) => (
                <button
                  key={`heading-${i + 1}`}
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: i + 1 })
                      .run()
                  }
                  className={`btn-menu ${
                    editor.isActive("heading", { level: i + 1 })
                      ? "is-active"
                      : ""
                  }`}
                >
                  <i className={`bi bi-type-h${i + 1}`}></i>
                </button>
              ))}
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`btn-menu ${
                  editor.isActive("bulletList") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-list-task"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`btn-menu ${
                  editor.isActive("orderedList") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-list-ol"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`btn-menu ${
                  editor.isActive("codeBlock") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-code-square"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`btn-menu ${
                  editor.isActive("blockquote") ? "is-active" : ""
                }`}
              >
                <i className="bi bi-blockquote-left"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="btn-menu"
              >
                <i className="bi bi-hr"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().setHardBreak().run()}
                className="btn-menu"
              >
                <i className="bi bi-file-break"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="btn-menu"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="btn-menu"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              <button
                onClick={() => editor.chain().focus().setColor("#958DF1").run()}
                className={`btn-menu ${
                  editor.isActive("textStyle", { color: "#958DF1" })
                    ? "is-active"
                    : ""
                }`}
              >
                <i className="bi bi-highlighter"></i>
              </button>
            </div>

            {/* Table Management Buttons */}
            <div className="button-group mx-auto table-settings d-flex justify-content-center py-1">
              <button
                className="btn-menu"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                <i className="bi bi-table"></i>
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
              >
                Add column before
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                Add column after
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().deleteColumn().run()}
              >
                Delete column
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().addRowBefore().run()}
              >
                Add row before
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                Add row after
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().deleteRow().run()}
              >
                Delete row
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                Delete table
              </button>
              <button
                className="btn-menu"
                onClick={() => editor.chain().focus().mergeOrSplit().run()}
              >
                Merge or split
              </button>
              <button
                className="btn-menu"
                onClick={() =>
                  editor.chain().focus().setCellAttribute("colspan", 2).run()
                }
              >
                Set cell attribute
              </button>
            </div>
          </div>

          <EditorContent editor={editor} />
        </>
      )}
    </>
  );
};

export default NoteEditor;
