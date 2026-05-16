import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <div className="app-container">
        <Sidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}

export default App;
