import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ youtubeUrl, startTime }) => {
  // Add the start time as a query parameter to the YouTube URL
  const getVideoUrlWithTimestamp = () => {
    if (youtubeUrl && startTime) {
      const url = new URL(youtubeUrl);
      url.searchParams.set('start', startTime); // Add 'start' parameter
      return url.toString();
    }
    return youtubeUrl;
  };

  return (
    <div style={{ height: '250px', backgroundColor: '#f0f0f0' }}>
      {youtubeUrl && ReactPlayer.canPlay(youtubeUrl) ? (
        <ReactPlayer
          url={getVideoUrlWithTimestamp()}
          controls
          width="100%"
          height="100%"
        />
      ) : (
        <p style={{ textAlign: 'center', paddingTop: '100px' }}>
          Enter a valid YouTube URL to play the video
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
