import React from 'react';

const FollowupButtons = ({ followups, onFollowupClick, disabled }) => {
  if (!followups || followups.length === 0) return null;

  return (
    <div className="container p-2">
      <div className="row">
        {followups.map((followup, idx) => (
          <div className="col-6 col-md-4 mb-2 d-flex" key={idx}>
            <button
              className={`w-100 p-1 ${disabled ? 'btn-disabled' : 'btn-green'}`}
              onClick={() => onFollowupClick(followup)}
              disabled={disabled}
            >
              {followup}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowupButtons;
