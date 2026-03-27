import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaLightbulb, FaQuestionCircle } from 'react-icons/fa';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm HerHustle AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
    scrollToBottom();
  }, [isOpen, messages]);

  useEffect(() => {
    if (isOpen) fetchSuggestions();
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/suggestions', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions.split('\n').filter(line => line.trim()));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = { id: Date.now(), text: inputMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });
      setIsTyping(false);
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { id: Date.now() + 1, text: data.message, sender: 'bot', timestamp: new Date() }]);
      } else {
        const errorData = await response.json();
        setMessages(prev => [...prev, { id: Date.now() + 1, text: errorData.message || "I'm having trouble connecting right now. Please try again later.", sender: 'bot', timestamp: new Date() }]);
      }
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm experiencing technical difficulties. Please try again in a moment.", sender: 'bot', timestamp: new Date() }]);
    }
  };

  const handleQuickHelp = async (topic) => {
    setMessages(prev => [...prev, { id: Date.now(), text: `Help me with ${topic}`, sender: 'user', timestamp: new Date() }]);
    setIsTyping(true);
    setShowSuggestions(false);
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/quick-help', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      setIsTyping(false);
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { id: Date.now() + 1, text: data.message, sender: 'bot', timestamp: new Date() }]);
      }
    } catch {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const quickHelpOptions = [
    { topic: 'resume', label: 'Resume', icon: '📝' },
    { topic: 'job_search', label: 'Job Search', icon: '🔍' },
    { topic: 'interview', label: 'Interview', icon: '💼' },
    { topic: 'platform', label: 'Platform', icon: '❓' }
  ];

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,500;1,300&display=swap');

        .hh-overlay {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          inset: 0;
          background: rgba(10, 5, 15, 0.65);
          backdrop-filter: blur(6px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: hhFadeIn 0.2s ease;
        }

        @keyframes hhFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes hhSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes hhBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        @keyframes hhMessageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hh-window {
          background: #fdfcfb;
          border-radius: 28px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.6);
          width: 100%;
          max-width: 600px;
          height: min(840px, calc(100vh - 3rem));
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: hhSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hh-header {
          background: linear-gradient(135deg, #e91e8c 0%, #c2185b 60%, #ad1457 100%);
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .hh-header::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 150px; height: 150px;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
        }

        .hh-header::after {
          content: '';
          position: absolute;
          bottom: -25px; left: 80px;
          width: 100px; height: 100px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }

        .hh-avatar {
          width: 48px; height: 48px;
          background: rgba(255,255,255,0.18);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(4px);
        }

        .hh-header-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 17px;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .hh-header-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          margin-top: 2px;
          font-weight: 300;
          display: flex; align-items: center; gap: 5px;
        }

        .hh-status-dot {
          width: 7px; height: 7px;
          background: #a8ff78;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(168,255,120,0.3);
        }

        .hh-close {
          background: rgba(255,255,255,0.15);
          border: none; cursor: pointer;
          width: 36px; height: 36px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.9);
          transition: background 0.15s;
          z-index: 1;
        }

        .hh-close:hover { background: rgba(255,255,255,0.25); }

        .hh-messages {
          flex: 1;
          overflow-y: auto;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fdfcfb;
          min-height: 0;
        }

        .hh-messages::-webkit-scrollbar { width: 4px; }
        .hh-messages::-webkit-scrollbar-track { background: transparent; }
        .hh-messages::-webkit-scrollbar-thumb { background: #e8d5df; border-radius: 4px; }

        .hh-msg-row {
          display: flex;
          animation: hhMessageIn 0.25s ease;
        }

        .hh-msg-row.user { justify-content: flex-end; }
        .hh-msg-row.bot { justify-content: flex-start; }

        .hh-bubble {
          max-width: 72%;
          padding: 14px 18px;
          border-radius: 20px;
          font-size: 14px;
          line-height: 1.6;
        }

        .hh-bubble.user {
          background: linear-gradient(135deg, #e91e8c, #c2185b);
          color: #fff;
          border-bottom-right-radius: 5px;
          box-shadow: 0 4px 18px rgba(233, 30, 140, 0.25);
        }

        .hh-bubble.bot {
          background: #f1eef5;
          color: #2d1f3d;
          border-bottom-left-radius: 5px;
          border: 1px solid rgba(200,180,215,0.3);
        }

        .hh-time {
          font-size: 10.5px;
          margin-top: 5px;
          display: block;
        }
        .hh-bubble.user .hh-time { color: rgba(255,255,255,0.6); text-align: right; }
        .hh-bubble.bot .hh-time { color: #b0a0c0; }

        .hh-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #f1eef5;
          border: 1px solid rgba(200,180,215,0.3);
          padding: 14px 18px;
          border-radius: 20px;
          border-bottom-left-radius: 5px;
          width: fit-content;
        }

        .hh-dot {
          width: 7px; height: 7px;
          background: #c06090;
          border-radius: 50%;
          animation: hhBounce 1.2s ease infinite;
        }
        .hh-dot:nth-child(2) { animation-delay: 0.15s; }
        .hh-dot:nth-child(3) { animation-delay: 0.3s; }

        .hh-suggestions {
          padding: 14px 24px;
          background: #fff8fb;
          border-top: 1px solid #f0e6ed;
          flex-shrink: 0;
        }

        .hh-section-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #b080a0;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .hh-suggestion-btn {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          color: #5a3a6a;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .hh-suggestion-btn:hover {
          background: #f7ecf4;
          color: #e91e8c;
        }

        .hh-quickhelp {
          padding: 14px 24px;
          background: #fff8fb;
          border-top: 1px solid #f0e6ed;
          flex-shrink: 0;
        }

        .hh-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .hh-chip {
          background: #fff;
          border: 1px solid #edd8e8;
          border-radius: 20px;
          padding: 7px 16px;
          font-size: 13px;
          cursor: pointer;
          color: #5a3a6a;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .hh-chip:hover {
          background: linear-gradient(135deg, #fce4f3, #f8d7ee);
          border-color: #e91e8c;
          color: #c2185b;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(233,30,140,0.12);
        }

        .hh-input-area {
          padding: 16px 24px 20px;
          background: #fff;
          border-top: 1px solid #f0e6ed;
          flex-shrink: 0;
        }

        .hh-form {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f7f0f5;
          border-radius: 50px;
          padding: 8px 8px 8px 20px;
          border: 1.5px solid transparent;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .hh-form:focus-within {
          border-color: #e91e8c;
          box-shadow: 0 0 0 3px rgba(233, 30, 140, 0.08);
          background: #fff;
        }

        .hh-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          color: #2d1f3d;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }

        .hh-input::placeholder { color: #c0a8c8; }
        .hh-input:disabled { opacity: 0.5; }

        .hh-send {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #e91e8c, #c2185b);
          border: none; cursor: pointer;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-size: 14px;
          transition: all 0.15s ease;
          box-shadow: 0 3px 10px rgba(233,30,140,0.3);
          flex-shrink: 0;
        }

        .hh-send:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 5px 15px rgba(233,30,140,0.4);
        }

        .hh-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .hh-footer-note {
          font-size: 10.5px;
          color: #c0a8c8;
          text-align: center;
          margin-top: 10px;
          letter-spacing: 0.02em;
        }
      `}</style>

      <div className="hh-overlay">
        <div className="hh-window">

          {/* Header */}
          <div className="hh-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
              <div className="hh-avatar">
                <FaRobot color="white" size={20} />
              </div>
              <div>
                <div className="hh-header-title">HerHustle Assistant</div>
                <div className="hh-header-sub">
                  <span className="hh-status-dot" />
                  Always here to help
                </div>
              </div>
            </div>
            <button className="hh-close" onClick={onClose}>
              <FaTimes size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="hh-messages">
            {messages.map((message) => (
              <div key={message.id} className={`hh-msg-row ${message.sender}`}>
                <div className={`hh-bubble ${message.sender}`}>
                  {message.text}
                  <span className="hh-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="hh-msg-row bot">
                <div className="hh-typing">
                  <div className="hh-dot" />
                  <div className="hh-dot" />
                  <div className="hh-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="hh-suggestions">
              <div className="hh-section-label">
                <FaLightbulb color="#e0a020" size={10} />
                Suggestions for you
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="hh-suggestion-btn"
                  onClick={() => setInputMessage(suggestion)}
                >
                  → {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Quick Help */}
          <div className="hh-quickhelp">
            <div className="hh-section-label">
              <FaQuestionCircle color="#9080c0" size={10} />
              Quick help
            </div>
            <div className="hh-chips">
              {quickHelpOptions.map((option) => (
                <button
                  key={option.topic}
                  className="hh-chip"
                  onClick={() => handleQuickHelp(option.topic)}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="hh-input-area">
            <form className="hh-form" onSubmit={handleSendMessage}>
              <input
                ref={inputRef}
                type="text"
                className="hh-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything…"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="hh-send"
                disabled={!inputMessage.trim() || isTyping}
              >
                <FaPaperPlane />
              </button>
            </form>
            <p className="hh-footer-note">Powered by AI · Responses are for guidance only</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Chatbot;