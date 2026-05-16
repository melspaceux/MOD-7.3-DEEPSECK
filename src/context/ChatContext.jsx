import React, { createContext, useReducer, useContext, useEffect } from 'react';

const ChatContext = createContext();

const initialState = {
  history: JSON.parse(localStorage.getItem('chat_history')) || [],
  currentChatId: null,
  messages: [],
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessages = [...state.messages, action.payload];
      
      // Update history if currentChatId exists
      let newHistory = state.history;
      if (state.currentChatId) {
        newHistory = state.history.map(chat => 
          chat.id === state.currentChatId 
            ? { ...chat, messages: newMessages }
            : chat
        );
      } else {
        // If it's a new chat, create an entry in history on first user message
        if (action.payload.role === 'user' && state.messages.length === 0) {
          const newId = Date.now().toString();
          const newChat = {
            id: newId,
            title: action.payload.content.substring(0, 30) + '...',
            messages: newMessages,
            date: new Date().toISOString()
          };
          return {
            ...state,
            currentChatId: newId,
            messages: newMessages,
            history: [newChat, ...state.history]
          };
        }
      }

      return {
        ...state,
        messages: newMessages,
        history: newHistory
      };
    }

    case 'NEW_CHAT':
      return {
        ...state,
        currentChatId: null,
        messages: []
      };

    case 'SELECT_CHAT': {
      const selectedChat = state.history.find(chat => chat.id === action.payload);
      return {
        ...state,
        currentChatId: action.payload,
        messages: selectedChat ? selectedChat.messages : []
      };
    }

    case 'DELETE_CHAT': {
      const newHistory = state.history.filter(chat => chat.id !== action.payload);
      return {
        ...state,
        history: newHistory,
        currentChatId: state.currentChatId === action.payload ? null : state.currentChatId,
        messages: state.currentChatId === action.payload ? [] : state.messages
      };
    }

    case 'SET_STREAMING_MESSAGE': {
      // Specialized action to update the LAST message (the assistant's streaming response)
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        const newMessages = [...state.messages.slice(0, -1), { ...lastMessage, content: action.payload }];
        
        let newHistory = state.history;
        if (state.currentChatId) {
          newHistory = state.history.map(chat => 
            chat.id === state.currentChatId 
              ? { ...chat, messages: newMessages }
              : chat
          );
        }

        return {
          ...state,
          messages: newMessages,
          history: newHistory
        };
      }
      return state;
    }

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Persistence
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(state.history));
  }, [state.history]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
