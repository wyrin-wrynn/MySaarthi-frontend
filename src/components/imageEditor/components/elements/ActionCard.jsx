// components/imageEditor/components/ActionCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ActionCard = ({ title, onAction }) => {
  // Handler for key down events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent default to avoid unwanted behaviors like page scrolling
      onAction();
    }
  };

  return (
    <Card
      onClick={onAction}
      onKeyDown={handleKeyDown}
      sx={{
        margin: 1,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
        userSelect: 'none',
        outline: 'none', // Remove default outline
        '&:focus': {
          boxShadow: 8,
          border: '2px solid #1976d2', // Highlight on focus
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50px', // Adjust height as needed
      }}
      role="button"
      tabIndex={0}
    >
      <Typography variant="h6" component="div" align="center">
        {title}
      </Typography>
    </Card>
  );
};

export default ActionCard;
