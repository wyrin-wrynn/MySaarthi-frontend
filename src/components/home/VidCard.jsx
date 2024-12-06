import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

function VideoCard({ videoUrl, title }) {
  return (
    <Card
      sx={{
        width: 300, // Fixed width for uniform grid layout
        height: 250, // Fixed height to ensure consistent card size
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Video Section */}
      <CardMedia
        component="video"
        src={videoUrl}
        controls
        sx={{
          height: 200,
          width: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Title Below the Video */}
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <Typography variant="subtitle1" color="textPrimary" align="left">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default VideoCard;
