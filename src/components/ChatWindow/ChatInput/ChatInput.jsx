import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatInput({ onSend }) {
    const [text, setText] = useState('');
    const navigate = useNavigate();

    const handleSend = () => {
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents the default Enter key behavior (like form submission)
            handleSend();
        }
    };

    return (
        <div>
            <div className="mx-2 rounded border d-flex p-2 bg-white">
                <button className="btn-outline" onClick={() => navigate("/data-source")}>
                    <i className="bi bi-database-add"></i>
                </button>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown} // Add the onKeyDown event handler
                    className="chat-input w-100 mx-2 bg-light"
                    placeholder="start typing here"
                />
                <button className="btn-outline" onClick={handleSend}>
                    <i className="bi bi-send"></i>
                </button>
            </div>
        </div>
    );
}

export default ChatInput;
