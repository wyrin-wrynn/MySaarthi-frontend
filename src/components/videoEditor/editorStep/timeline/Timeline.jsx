// src/components/editor/Timeline.jsx

import React from "react";
import { Box } from "@mui/material";
import TimelineMarkers from "./TimelineMarkers";
import Lane from "./Lane";

const Timeline = ({
  lanes,
  currentFrame,
  totalDuration,
  onDeleteItem,
  onItemDrag,
}) => {
  return (
    <Box
      sx={{
        height: "auto",
        overflowX: "auto",
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "#eee",
      }}
    >
      {/* Timeline Markers */}
      <TimelineMarkers totalDuration={totalDuration} />

      {/* Red Progress Bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: `${(currentFrame / totalDuration) * 100}%`,
          height: "100%",
          width: "2px",
          backgroundColor: "red",
        }}
      />

      {/* Render Lanes Dynamically */}
      {lanes.map((lane) => (
        <Lane
          key={lane.id}
          laneId={lane.id}
          items={lane.items}
          color={lane.color}
          icon={lane.icon}
          totalDuration={totalDuration}
          label={lane.label}
          onDeleteItem={onDeleteItem}
          onItemDrag={onItemDrag}
        />
      ))}
    </Box>
  );
};

export default Timeline;
