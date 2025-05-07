import { useState, useEffect, useRef } from 'react';

// Main ChatBotPage component
export default function ChatBotPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "👋 Hello! I'm your Personal Finance Assistant. Ask me anything about your finances.", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Send message to backend and get response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });
      
      const data = await response.json();
      
      // Add bot response to chat
      const botMessage = {
        id: messages.length + 2,
        text: data.response || "Sorry, I couldn't process your request.",
        sender: 'bot',
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, there was an error processing your request. Please try again.",
        sender: 'bot',
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-semibold" style={{ color: '#4a3aff' }}>
            Personal Finance Assistant
          </h1>
        </div>
      </header>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg py-3 px-4 max-w-xs">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your finances..."
              className="flex-1 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ focusRingColor: '#4a3aff' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50"
              style={{ backgroundColor: '#4a3aff' }}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Type 'exit', 'quit', or 'bye' to end the conversation
          </p>
        </div>
      </div>
    </div>
  );
}

// Individual chat message component
function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`rounded-lg py-3 px-4 max-w-xs md:max-w-md lg:max-w-lg ${
          isBot 
            ? 'bg-gray-200 text-gray-800' 
            : 'text-white'
        }`}
        style={{ backgroundColor: isBot ? undefined : '#4a3aff' }}
      >
        {message.text}
      </div>
    </div>
  );
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex space-x-1 items-center">
      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-75"></div>
      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-150"></div>
    </div>
  );
}