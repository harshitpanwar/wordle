// components/Popup.tsx

import React from 'react';

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>{message}</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <style jsx>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .popup-inner {
          background: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
        }
      `}</style>
    </div>
  );
};

export default Popup;
