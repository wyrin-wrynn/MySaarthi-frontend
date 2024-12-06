// src/components/editor/timeline/TimelineMarkers.jsx

import React from "react";
import { Box } from "@mui/material";

const TimelineMarkers = ({ totalDuration }) => {
  const generateTimelineMarkers = () => {
    const markers = [];
    const totalSeconds = Math.ceil(totalDuration / 30); // Assuming 30 FPS
    for (let i = 0; i <= totalSeconds; i++) {
      markers.push(i);
    }
    return markers;
  };

  const timelineMarkers = generateTimelineMarkers();

  return (
    <Box
      sx={{
        position: "relative",
        height: "15px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #ddd",
      }}
    >
      {timelineMarkers.map((second) => (
        <Box
          key={second}
          sx={{
            position: "absolute",
            left: `${(second / (totalDuration / 30)) * 100}%`,
            fontSize: "10px",
            textAlign: "center",
            width: "30px",
            transform: "translateX(-50%)",
          }}
        >
          {second}
        </Box>
      ))}
    </Box>
  );
};

export default TimelineMarkers;
