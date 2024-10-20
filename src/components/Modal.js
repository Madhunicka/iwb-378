import React from 'react';

const Modal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 max-w-full">
      <div className="bg-white rounded-lg relative p-4">
        <button
          className="absolute top-2 right-2 text-red-500 text-lg"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={imageSrc}
          alt="Screenshot"
          className="max-w-full max-h-screen" 
        />
      </div>
    </div>
  );
};

export default Modal;
