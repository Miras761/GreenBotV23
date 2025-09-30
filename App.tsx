import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator';
import { LogoIcon } from './components/icons';
import { useApiKey } from './hooks/useApiKey';
import { ApiKeyModal } from './components/ApiKeyModal';

enum Tab {
  Chat,
  GenerateImage,
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Chat);
  const { apiKey, setApiKey } = useApiKey();

  if (!apiKey) {
    return <ApiKeyModal onSubmit={setApiKey} />;
  }

  const TabButton = ({
    tab,
    children,
  }: {
    tab: Tab;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tab
          ? 'bg-green-500 text-white shadow'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col font-sans text-gray-200">
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg p-4 flex justify-between items-center border-b border-green-900">
        <div className="flex items-center space-x-3">
          <LogoIcon className="h-8 w-8 text-white"/>
          <div>
            <h1 className="text-xl font-bold">GreenBot</h1>
            <p className="text-xs text-green-200">by GreenGamesStudio</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <TabButton tab={Tab.Chat}>Chat</TabButton>
            <TabButton tab={Tab.GenerateImage}>Generate Image</TabButton>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full p-4 md:p-6">
        <div className="w-full max-w-4xl h-full flex flex-col">
          {activeTab === Tab.Chat && <ChatInterface />}
          {activeTab === Tab.GenerateImage && <ImageGenerator />}
        </div>
      </main>
    </div>
  );
};

export default App;