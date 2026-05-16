import * as React from "react";

const GlobalContext = React.createContext();

const initialState = {
  history: JSON.parse(localStorage.getItem("history")) || [],
  currentChat: [], // Messages in the current conversation
};

function globalReducer(state, action) {
  switch (action.type) {
    case "@save_history": {
      if (!state.currentChat?.length) return state;
      
      const newChat = {
        id: crypto.randomUUID(),
        title: state.currentChat[0].content.substring(0, 30) + (state.currentChat[0].content.length > 30 ? "..." : ""),
        content: state.currentChat,
        date: new Date().toISOString()
      };

      const newHistory = [newChat, ...state.history];
      localStorage.setItem("history", JSON.stringify(newHistory));

      return {
        ...state,
        history: newHistory,
        currentChat: [] // Clear current chat after saving
      };
    }

    case "@load_messages": {
      const selectedChat = state.history.find(chat => chat.id === action.payload);
      return {
        ...state,
        currentChat: selectedChat ? selectedChat.content : []
      };
    }

    case "@update_current_chat": {      
      return { 
        ...state, 
        currentChat: action.payload 
      };
    }

    case "@delete_chat": {
      const newHistory = state.history.filter(chat => chat.id !== action.payload);
      localStorage.setItem("history", JSON.stringify(newHistory));
      return {
        ...state,
        history: newHistory
      };
    }

    case "@add_message": {
      const newChat = [...state.currentChat, action.payload];
      return {
        ...state,
        currentChat: newChat
      };
    }

    case "@update_last_message": {
      const lastIdx = state.currentChat.length - 1;
      if (lastIdx >= 0) {
        const updatedChat = [...state.currentChat];
        updatedChat[lastIdx] = { ...updatedChat[lastIdx], content: action.payload };
        return {
          ...state,
          currentChat: updatedChat
        };
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

function GlobalProvider({ children }) {
  const [state, dispatch] = React.useReducer(globalReducer, initialState);
  const value = { state, dispatch };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

function useGlobal() {
  const context = React.useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}

export { GlobalProvider, useGlobal };
