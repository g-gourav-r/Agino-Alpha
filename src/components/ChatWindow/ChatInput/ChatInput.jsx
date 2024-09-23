import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState('');
    const navigate = useNavigate();

    const handleSend = () => {
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !disabled) { // Check if not disabled
            e.preventDefault(); // Prevents the default Enter key behavior (like form submission)
            handleSend();
        }
    };

    return (
        <div>
            <div className="mx-2 rounded border d-flex p-2 bg-white">
                <button className="btn-outline" onClick={() => navigate("/dbsource")}>
                    <i className="bi bi-database-add"></i>
                </button>
                <input
                    type="text"
                    value={disabled ? '' : text} // Clear the input if disabled
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="chat-input w-100 mx-2 bg-light"
                    placeholder={disabled ? "Start a new chat to begin talking with your database." : "Start typing here"}
                    disabled={disabled}
                />
                <button className="btn-outline" onClick={handleSend} disabled={disabled}> {/* Disable button if disabled */}
                    <i className="bi bi-send"></i>
                </button>
            </div>
        </div>
    );
}

export default ChatInput;
