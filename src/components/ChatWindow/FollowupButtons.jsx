import React from 'react';

const FollowupButtons = ({ followups, onFollowupClick }) => {
  if (!followups || followups.length === 0) return null;

  return (
    <div className="container p-2 ">
      <div className="row">
        {followups.map((followup, idx) => (
          <div className="col-6 col-md-4 mb-2 d-flex" key={idx}>
            <button
              className="btn-green w-100 p-2"
              onClick={() => onFollowupClick(followup)}
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
