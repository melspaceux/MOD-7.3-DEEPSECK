import React from 'react';
import { useChat } from '../context/ChatContext';

export function Sidebar() {
  const { state, dispatch } = useChat();

  return (
    <aside className="sidebar">
      <button 
        className="new-chat-btn"
        onClick={() => dispatch({ type: 'NEW_CHAT' })}
      >
        <span className="plus-icon">+</span> Nuevo Chat
      </button>

      <div className="history-list">
        <h3>Historial</h3>
        {state.history.length === 0 ? (
          <p className="empty-msg">No hay chats previos</p>
        ) : (
          state.history.map((chat) => (
            <div 
              key={chat.id} 
              className={`history-item ${state.currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SELECT_CHAT', payload: chat.id })}
            >
              <div className="chat-info">
                <span className="chat-title">{chat.title}</span>
                <span className="chat-date">{new Date(chat.date).toLocaleDateString()}</span>
              </div>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'DELETE_CHAT', payload: chat.id });
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="model-badge">DeepSeek-R1</div>
      </div>
    </aside>
  );
}
