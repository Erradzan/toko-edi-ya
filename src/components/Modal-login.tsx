import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isDarkMode: boolean;
}

const ModalLogin: React.FC<ModalProps> = ({ isOpen, onClose, title, message, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-[#888888]' : 'bg-white'} bg-opacity-50 z-50`}>
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button
          className="bg-[#40b446] text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalLogin;