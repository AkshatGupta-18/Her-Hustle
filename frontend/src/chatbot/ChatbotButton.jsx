import React from 'react';
import { FaRobot, FaComment } from 'react-icons/fa';

const ChatbotButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
        isOpen 
          ? 'bg-gray-500 hover:bg-gray-600' 
          : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-500/50'
      }`}
      style={{
        zIndex: 1000,
        boxShadow: isOpen 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          : '0 10px 15px -3px rgba(236, 72, 153, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
      }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <FaComment className="text-white text-xl" />
      ) : (
        <FaRobot className="text-white text-xl" />
      )}
    </button>
  );
};

export default ChatbotButton;