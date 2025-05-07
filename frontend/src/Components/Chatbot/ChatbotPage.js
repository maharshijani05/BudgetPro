import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// Main ChatBotPage component
export default function ChatBotPage() {
    const { dbUser } = useAuth();
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
  
  // Apply global styles for animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      .animate-pulse {
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      .delay-75 {
        animation-delay: 0.15s;
      }
      .delay-150 {
        animation-delay: 0.3s;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      const response = await fetch(`http://localhost:5000/chat/${dbUser._id}`, {
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
    <div className="flex flex-col" style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 64px)', marginTop: '20px' }}>
      {/* Main Container */}
      <div style={{
        maxWidth: '700px',
        width: '100%',
        margin: 'auto',
        height: 'calc(100vh - 84px)',
        backgroundColor: '#ffffff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {/* Chat Header */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            color: 'black',
            margin: 0
          }}>
            Personal Finance Assistant
          </h1>
        </div>

        {/* Chat Area */}
        <div style={{ 
          flex: '1', 
          overflowY: 'auto', 
          padding: '1rem',
          height: 'calc(100vh - 180px)',
          marginBottom: '6rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.5rem', 
                  padding: '0.75rem 1rem',
                  maxWidth: '20rem'
                }}>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderTop: '1px solid #e5e7eb',
          padding: '1rem',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your finances..."
              style={{ 
                flex: '1',
                border: '1px solid #d1d5db', 
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 2px rgba(74, 58, 255, 0.3)';
                e.target.style.borderColor = '#4a3aff';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = '#d1d5db';
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              style={{ 
                backgroundColor: '#4a3aff',
                color: 'white',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                opacity: isLoading ? '0.5' : '1',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
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
    <div style={{ 
      display: 'flex', 
      justifyContent: isBot ? 'flex-start' : 'flex-end'
    }}>
      <div style={{ 
        backgroundColor: isBot ? '#e5e7eb' : '#4a3aff',
        color: isBot ? '#1f2937' : 'white',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        maxWidth: '20rem',
        wordBreak: 'break-word'
      }}>
        {message.text}
      </div>
    </div>
  );
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '9999px', 
        backgroundColor: '#6b7280',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}></div>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '9999px', 
        backgroundColor: '#6b7280',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: '0.15s'
      }}></div>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '9999px', 
        backgroundColor: '#6b7280',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: '0.3s'
      }}></div>
    </div>
  );
}