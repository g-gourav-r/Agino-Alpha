import React from 'react';

const FollowupButtons = ({ followups, onFollowupClick }) => {
  if (!followups || followups.length === 0) return null;

  return (
  <div className='p-2 m-2'>
    <div className="followups mt-2 mx-2">
      {followups.map((followup, idx) => (
        <button
          key={idx}
          className="btn-green w-100 p-2 mb-2"
          onClick={() => onFollowupClick(followup)}
        >
          {followup}
        </button>
      ))}
    </div>
    </div>
  );
};

export default FollowupButtons;
