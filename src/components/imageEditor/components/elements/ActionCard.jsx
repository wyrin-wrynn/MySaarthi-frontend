import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ActionCard = ({ title, imageSrc, onAction }) => {
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
        outline: 'none',
        '&:focus': {
          boxShadow: 8,
          border: '2px solid #1976d2',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100px', // Fixed height
        width: '100px', // Fixed width
        textAlign: 'center',
      }}
      role="button"
      tabIndex={0}
    >
      <Box
        sx={{
          height: '50px', // Image container height
          width: '50px', // Image container width
          marginBottom: 1,
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            {title}
          </Typography>
        )}
      </Box>
      <Typography
        variant="body2"
        component="div"
        align="center"
        sx={{ fontSize: '12px', wordWrap: 'break-word' }}
      >
        {title}
      </Typography>
    </Card>
  );
};

export default ActionCard;
