import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useOllama } from '../hooks/useOllama';

export function ChatWindow() {
  const { state } = useChat();
  const { sendMessage, loading } = useOllama();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    sendMessage(input);
    setInput('');
  };

  return (
    <main className="chat-window">
      <header className="chat-header">
        <h2>DevfSeek <span className="ai-tag">AI</span></h2>
      </header>

      <div className="messages-container">
        {state.messages.length === 0 ? (
          <div className="welcome-screen">
            <h1>¿En qué puedo ayudarte hoy?</h1>
            <p>Escribe tu consulta para comenzar a interactuar con DeepSeek.</p>
          </div>
        ) : (
          state.messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className="avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                {msg.content || (loading && index === state.messages.length - 1 ? <span className="typing">...</span> : '')}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-footer">
        <form onSubmit={handleSubmit} className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta a DevfSeek..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? '...' : '↑'}
          </button>
        </form>
        <p className="disclaimer">DeepSeek puede cometer errores. Considera verificar la información importante.</p>
      </footer>
    </main>
  );
}
