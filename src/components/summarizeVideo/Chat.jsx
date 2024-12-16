import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
      setInput('');

      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: `AI response to: "${input}"`, sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Chat Messages */}
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            style={{
              display: 'flex',
              justifyContent:
                message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
            }}
          >
            <Box
              style={{
                maxWidth: '70%',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor:
                  message.sender === 'user' ? '#d1e7ff' : '#e8e8e8',
                color: '#000',
              }}
            >
              {message.text}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Chat Input */}
      <Box
        style={{
          display: 'flex',
          padding: '8px',
          borderTop: '1px solid #ccc',
          backgroundColor: '#fff',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ marginRight: '8px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
