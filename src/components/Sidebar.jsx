import React from 'react';
import { useGlobal } from '../context/global-context';

export function Sidebar() {
  const { state, dispatch } = useGlobal();

  return (
    <aside className="sidebar">
      <button 
        className="new-chat-btn"
        onClick={() => dispatch({ type: '@save_history' })}
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
              className="history-item"
              onClick={() => dispatch({ type: '@load_messages', payload: chat.id })}
            >
              <div className="chat-info">
                <span className="chat-title">{chat.title}</span>
                <span className="chat-date">{new Date(chat.date).toLocaleDateString()}</span>
              </div>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: '@delete_chat', payload: chat.id });
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
