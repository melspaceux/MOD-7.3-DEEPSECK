import React from 'react';
import { GlobalProvider } from './context/global-context';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import './App.css';

function App() {
  return (
    <GlobalProvider>
      <div className="app-container">
        <Sidebar />
        <ChatWindow />
      </div>
    </GlobalProvider>
  );
}

export default App;
